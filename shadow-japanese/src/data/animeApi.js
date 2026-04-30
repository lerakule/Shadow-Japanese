// Jikan API - 免费的MyAnimeList非官方API
// API文档: https://docs.api.jikan.moe/

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// 请求间隔限制：3秒内不超过一次
let lastRequestTime = 0;
const REQUEST_INTERVAL = 3500; // 3.5秒间隔以确保安全

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const throttledFetch = async (url) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    await delay(REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }
  
  return response.json();
};

/**
 * 获取热门动漫列表
 * @param {number} page - 页码
 * @param {number} limit - 每页数量(1-25)
 */
export const getTopAnime = async (page = 1, limit = 10) => {
  const data = await throttledFetch(
    `${JIKAN_API_BASE}/top/anime?page=${page}&limit=${limit}`
  );
  
  return {
    anime: data.data.map(formatAnimeData),
    pagination: data.pagination,
  };
};

/**
 * 搜索动漫
 * @param {string} query - 搜索关键词
 * @param {number} page - 页码
 */
export const searchAnime = async (query, page = 1) => {
  const data = await throttledFetch(
    `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=10&sfw=true`
  );
  
  return {
    anime: data.data.map(formatAnimeData),
    pagination: data.pagination,
  };
};

/**
 * 获取当前季节动漫
 * @param {number} page - 页码
 */
export const getSeasonalAnime = async (page = 1) => {
  const data = await throttledFetch(
    `${JIKAN_API_BASE}/seasons/now?page=${page}&limit=10`
  );
  
  return {
    anime: data.data.map(formatAnimeData),
    pagination: data.pagination,
  };
};

/**
 * 获取动漫详细信息
 * @param {number} malId - MyAnimeList ID
 */
export const getAnimeDetails = async (malId) => {
  const data = await throttledFetch(`${JIKAN_API_BASE}/anime/${malId}/full`);
  return formatAnimeData(data.data);
};

/**
 * 获取动漫台词/名言
 */
export const getAnimeQuotes = async () => {
  const data = await throttledFetch(`${JIKAN_API_BASE}/quotes`);
  return data.data;
};

/**
 * 格式化动漫数据
 */
const formatAnimeData = (anime) => ({
  id: anime.mal_id,
  title: anime.title,
  titleJapanese: anime.title_japanese || anime.title,
  titleEnglish: anime.title_english || '',
  coverImage: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
  type: anime.type,
  episodes: anime.episodes,
  status: anime.status,
  score: anime.score,
  rank: anime.rank,
  popularity: anime.popularity,
  synopsis: anime.synopsis,
  genres: anime.genres?.map(g => g.name) || [],
  themes: anime.themes?.map(t => t.name) || [],
  studios: anime.studios?.map(s => s.name) || [],
  year: anime.year,
  season: anime.season,
  duration: anime.duration,
  rating: anime.rating,
  source: anime.source,
  streaming: anime.trailer?.url ? [{
    name: 'YouTube',
    url: anime.trailer.url,
    image: anime.trailer.images?.maximum_image_url
  }] : [],
});

/**
 * 根据ID获取推荐内容
 * @param {number} malId - MyAnimeList ID
 */
export const getAnimeRecommendations = async (malId) => {
  const data = await throttledFetch(`${JIKAN_API_BASE}/anime/${malId}/recommendations`);
  return data.data.map(rec => ({
    malId: rec.entry.mal_id,
    title: rec.entry.title,
    image: rec.entry.images?.jpg?.image_url,
  }));
};
