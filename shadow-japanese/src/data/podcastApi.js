// 真人语音播客 RSS 集成

export const PODCAST_SOURCES = [
  {
    id: 'nhk-radio',
    name: 'NHKラジオニュース',
    nameCn: 'NHK广播新闻',
    url: 'https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml',
    description: 'NHK官方日语广播新闻，真人播音，适合N1-N2新闻听力跟读。',
    difficulty: 'N1',
    fallbackItems: [
      {
        title: 'NHKラジオニュース（备用真人音频）',
        audioUrl: 'https://www.nhk.or.jp/s-media/news/podcast/audio/eda5f33cc6fc325214e5c1b7d111c806_64k.mp3',
        publishDate: 'Fri, 01 May 2026 00:10:00 +0900',
      }
    ],
  },
];

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const DEFAULT_TIMEOUT_MS = 3500;

const decodeEntities = (value = '') => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .trim();

const stripHtml = (value = '') => decodeEntities(value)
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+\n/g, '\n')
  .replace(/\n\s+/g, '\n')
  .replace(/[ \t]+/g, ' ')
  .trim();

const getTagValue = (xml, tagName) => {
  const match = xml.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
};

const getAttrValue = (xml, attrName) => {
  const match = xml.match(new RegExp(`${attrName}=["']([^"']+)["']`, 'i'));
  return match ? decodeEntities(match[1]) : '';
};

const getAudioUrl = (itemXml) => {
  const enclosure = itemXml.match(/<enclosure\b[^>]*>/i)?.[0] || '';
  const mediaContent = itemXml.match(/<media:content\b[^>]*>/i)?.[0] || '';
  return getAttrValue(enclosure, 'url') || getAttrValue(mediaContent, 'url');
};

const getItems = (xml) => xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

const toPodcastContent = ({ source, index, title, description, audioUrl, pubDate, link, isFallback = false }) => ({
  id: `podcast-${source.sourceId || source.id}-${index}${isFallback ? '-fallback' : ''}`,
  title,
  titleCn: source.sourceName || source.name || '真人音频',
  body: description || 'この音声には文字起こしがありません。必要に応じて、練習ページで聞き取った内容や自分で用意した台本を貼り付けてください。',
  bodyCn: isFallback
    ? '当前使用备用真人音频。真人播客RSS可能受网络或CORS限制，仍可播放音频并粘贴/听写日文原文进行跟读。'
    : '真人播客音频通常不附带完整文字稿。你可以在练习页粘贴日文原文或听写文本后进行影子跟读。',
  audioUrl,
  duration: 300,
  difficulty: source.difficulty || 'N2',
  category: 'podcast',
  hasAudio: true,
  needsTranscript: true,
  sourceName: source.sourceName || source.name,
  publishDate: pubDate,
  originalUrl: link,
  isFallback,
  grammars: [
    {
      pattern: '真人音频跟读',
      meaning: '先听真人语音，再延迟半拍模仿语调、停顿和重音。',
      formation: '播放音频 → 分段跟读 → 录音 → 回听对比',
      examples: ['聞こえた音を、少し遅れてそのまま真似します。']
    }
  ]
});

export function parsePodcastXml(xml, source) {
  return getItems(xml)
    .map((itemXml, index) => {
      const title = stripHtml(getTagValue(itemXml, 'title')) || `${source.name} ${index + 1}`;
      const description = stripHtml(getTagValue(itemXml, 'description'));
      const pubDate = getTagValue(itemXml, 'pubDate');
      const link = getTagValue(itemXml, 'link');
      const audioUrl = getAudioUrl(itemXml);

      if (!audioUrl) return null;

      return toPodcastContent({ source, index, title, description, audioUrl, pubDate, link });
    })
    .filter(Boolean);
}

export function getPodcastFallbackItems(source, limit = 10) {
  return (source.fallbackItems || [])
    .slice(0, limit)
    .map((item, index) => toPodcastContent({
      source,
      index,
      title: item.title,
      description: item.description || 'この音声には文字起こしがありません。練習ページで台本を貼り付けてください。',
      audioUrl: item.audioUrl,
      pubDate: item.publishDate || '',
      link: item.link || '',
      isFallback: true,
    }));
}

const withTimeout = (promise, timeoutMs) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
  Promise.resolve(promise)
    .then(resolve)
    .catch(reject)
    .finally(() => clearTimeout(timer));
});

async function fetchText(url, fetcher, timeoutMs) {
  const response = await withTimeout(fetcher(url), timeoutMs);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function fetchTextWithFallback(url, options = {}) {
  const fetcher = options.fetcher || fetch;
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  try {
    return await fetchText(url, fetcher, timeoutMs);
  } catch (directError) {
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    try {
      return await fetchText(proxyUrl, fetcher, timeoutMs);
    } catch (proxyError) {
      throw new Error(`RSS读取失败：${directError.message}; proxy: ${proxyError.message}`);
    }
  }
}

export async function fetchPodcastFeed(source, limit = 10, options = {}) {
  try {
    const xml = await fetchTextWithFallback(source.url, options);
    const parsedItems = parsePodcastXml(xml, source).slice(0, limit);
    if (parsedItems.length > 0) return parsedItems;
    throw new Error('RSS中没有可播放音频');
  } catch (error) {
    const fallbackItems = getPodcastFallbackItems(source, limit);
    if (fallbackItems.length > 0) return fallbackItems;
    throw error;
  }
}

export async function fetchPodcastSourceById(sourceId, limit = 10, options = {}) {
  const source = PODCAST_SOURCES.find(item => item.id === sourceId);
  if (!source) throw new Error(`未知播客源：${sourceId}`);
  return fetchPodcastFeed(source, limit, options);
}

export function createCustomPodcastSource(url) {
  return {
    id: `custom-${Date.now()}`,
    name: '自定义RSS',
    nameCn: '自定义真人音频源',
    url,
    description: '用户输入的播客RSS源。',
    difficulty: 'N2',
  };
}

export default {
  PODCAST_SOURCES,
  parsePodcastXml,
  getPodcastFallbackItems,
  fetchPodcastFeed,
  fetchPodcastSourceById,
  createCustomPodcastSource,
};
