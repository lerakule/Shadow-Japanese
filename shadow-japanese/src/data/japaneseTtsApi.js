// 日语语音API服务
// 整合多种TTS和新闻API

import { japaneseTTS } from '../utils/tts';

// 语音合成配置
const TTS_CONFIG = {
  // Web Speech API (内置，无需API key)
  webSpeech: {
    name: 'Web Speech API',
    description: '浏览器内置语音合成，无需API Key',
    rate: 0.85,
    pitch: 1,
    available: typeof window !== 'undefined' && 'speechSynthesis' in window,
  },
  
  // Google Cloud TTS (需要API Key)
  googleCloud: {
    name: 'Google Cloud TTS',
    description: '高质量神经网络语音，需API Key',
    voices: ['ja-JP-Standard-A', 'ja-JP-Wavenet-A', 'ja-JP-Neural2-A'],
    endpoint: 'https://texttospeech.googleapis.com/v1/text:synthesize',
    requiresKey: true,
  },
  
  // Azure Speech (需要API Key)
  azure: {
    name: 'Azure Speech TTS',
    description: '微软Azure语音服务，需API Key',
    voices: ['ja-JP-NanamiNeural', 'ja-JP-KeitaNeural'],
    endpoint: 'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1',
    requiresKey: true,
  },
};

// 日语新闻API列表
const NEWS_APIS = {
  nhkEasy: {
    name: 'NHK News Web Easy',
    nameCn: 'NHK简单日语新闻',
    description: 'NHK官方提供的简单日语新闻，带音频',
    endpoint: 'https://www3.nhk.or.jp/news/easy/top-list.json',
    hasAudio: true,
    difficulty: 'N3-N2',
    language: '日本語',
  },
  newsApiJP: {
    name: 'News API (Japan)',
    nameCn: '综合新闻API',
    description: 'World News API 日本新闻',
    endpoint: 'https://newsapi.org/v2/top-headlines?country=jp',
    hasAudio: false,
    difficulty: 'N1',
    language: '日本語',
  },
};

// 生成音频URL (用于外链)
export function generateAudioUrl(text, provider = 'web') {
  // 这里可以扩展其他TTS服务
  switch (provider) {
    case 'google':
      // Google Cloud TTS 需要后端代理
      return null;
    case 'azure':
      // Azure TTS 需要后端代理
      return null;
    default:
      return 'tts'; // 使用Web Speech API
  }
}

// 流式播放日语文本
export async function streamJapaneseSpeech(text, options = {}) {
  const {
    rate = TTS_CONFIG.webSpeech.rate,
    pitch = TTS_CONFIG.webSpeech.pitch,
    volume = 1,
  } = options;
  
  // 初始化TTS
  await japaneseTTS.init();
  
  // 使用Web Speech API播放
  return japaneseTTS.speak(text, {
    rate,
    pitch,
    volume,
  });
}

// 停止播放
export function stopSpeech() {
  japaneseTTS.stop();
}

// 检查TTS是否可用
export function isTTSAvailable() {
  return TTS_CONFIG.webSpeech.available;
}

// 获取支持的TTS配置
export function getTTSConfig() {
  return TTS_CONFIG;
}

// 获取新闻API配置
export function getNewsAPIConfig() {
  return NEWS_APIS;
}

export default {
  streamJapaneseSpeech,
  stopSpeech,
  isTTSAvailable,
  getTTSConfig,
  getNewsAPIConfig,
  generateAudioUrl,
};
