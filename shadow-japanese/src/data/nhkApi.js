// NHK News Web Easy API 集成
// API文档: https://www3.nhk.or.jp/news/easy/top-list.json

const NHK_API_BASE = 'https://www3.nhk.or.jp/news/easy';
const NHK_API_WORD_BASE = 'https://www.nhk.or.jp/vocab-book/api/latest';

// 获取NHK新闻列表
export async function fetchNHKNewsList() {
  try {
    const response = await fetch(`${NHK_API_BASE}/top-list.json`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map(item => ({
      id: `nhk-${item.news_id}`,
      title: item.title,
      titleCn: '', // NHK Easy新闻没有中文翻译
      body: item.kanji || item.title_with_ruby,
      bodyCn: '',
      audioUrl: `${NHK_API_BASE}/${item.news_id}.mp3`,
      duration: 60, // 估算60秒
      difficulty: 'N2', // NHK Easy 适合 N2-N3 水平
      category: 'NHKニュース',
      hasAudio: true,
      newsId: item.news_id,
      newsWebUrl: `https://www3.nhk.or.jp/news/easy/${item.news_id}/`,
      publishDate: item.news_publication_time,
    }));
  } catch (error) {
    console.error('Failed to fetch NHK news:', error);
    return [];
  }
}

// 获取单条NHK新闻详情
export async function fetchNHKNewsDetail(newsId) {
  try {
    const response = await fetch(`${NHK_API_BASE}/news/${newsId}.json`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      id: `nhk-${data.news_id}`,
      title: data.title,
      titleCn: '',
      body: data.kanji || data.title_with_ruby,
      bodyCn: '',
      audioUrl: `${NHK_API_BASE}/${data.news_id}.mp3`,
      duration: 60,
      difficulty: 'N2',
      category: 'NHKニュース',
      hasAudio: true,
      newsId: data.news_id,
      newsWebUrl: `https://www3.nhk.or.jp/news/easy/${data.news_id}/`,
      publishDate: data.news_publication_time,
    };
  } catch (error) {
    console.error('Failed to fetch NHK news detail:', error);
    return null;
  }
}

// 获取NHK词汇学习内容
export async function fetchNHKVocab() {
  try {
    const response = await fetch(`${NHK_API_WORD_BASE}/words.json`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch NHK vocab:', error);
    return [];
  }
}

// 检查NHK API是否可用
export async function checkNHKApiStatus() {
  try {
    const response = await fetch(`${NHK_API_BASE}/top-list.json`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  fetchNHKNewsList,
  fetchNHKNewsDetail,
  fetchNHKVocab,
  checkNHKApiStatus,
};
