import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp, ActionTypes } from '../context/AppContext';
import { japaneseTTS } from '../utils/tts';

// 音频播放器 Hook - 支持 TTS 语音合成
export function useAudioPlayer(audioUrl, text = '') {
  const { state, dispatch } = useApp();
  const audioRef = useRef(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isTTS, setIsTTS] = useState(false);
  const ttsIntervalRef = useRef(null);
  const ttsStartTimeRef = useRef(0);

  useEffect(() => {
    // 判断是否使用 TTS
    const useTTS = audioUrl === 'tts' || !audioUrl || audioUrl.startsWith('/audio/');
    setIsTTS(useTTS);
    
    if (!audioUrl && !text) return;

    if (useTTS && text) {
      // TTS 模式：生成模拟波形
      const estimatedDuration = japaneseTTS.estimateDuration(text, state.playbackRate || 0.85);
      setDuration(estimatedDuration);
      
      // 生成模拟波形数据
      const mockData = Array(100).fill(0).map(() => Math.random() * 0.6 + 0.4);
      setWaveformData(mockData);
      
      return;
    }

    // 音频文件模式
    if (audioUrl && !audioUrl.startsWith('/audio/') && !audioUrl.startsWith('tts')) {
      // 外链音频
      const audio = new Audio(audioUrl);
      audio.preload = 'metadata';
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      // 事件监听
      audio.addEventListener('timeupdate', () => {
        dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: audio.currentTime });
      });

      audio.addEventListener('ended', () => {
        dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
      });

      audio.addEventListener('play', () => {
        dispatch({ type: ActionTypes.SET_PLAYING, payload: true });
      });

      audio.addEventListener('pause', () => {
        dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
      });

      // 加载音频数据用于波形
      loadAudioData(audioUrl);

      return () => {
        audio.pause();
        audio.src = '';
      };
    } else {
      // 内置音频文件不存在的情况，生成模拟波形
      setWaveformData(Array(100).fill(0).map(() => Math.random() * 0.8 + 0.2));
      setDuration(120); // 默认120秒
    }
  }, [audioUrl, text, dispatch, state.playbackRate]);

  // 加载音频数据用于波形显示
  const loadAudioData = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 提取波形数据
      const rawData = decodedBuffer.getChannelData(0);
      const samples = 100;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }

      // 归一化
      const maxVal = Math.max(...filteredData);
      const normalized = filteredData.map(d => d / maxVal);
      setWaveformData(normalized);

      await audioContext.close();
    } catch (error) {
      console.log('Using simulated waveform data');
      setWaveformData(Array(100).fill(0).map(() => Math.random() * 0.8 + 0.2));
    }
  };

  const play = useCallback(() => {
    if (isTTS && text) {
      // TTS 模式
      ttsStartTimeRef.current = Date.now();
      
      // 初始化 TTS
      japaneseTTS.init().then(() => {
        // 更新状态
        dispatch({ type: ActionTypes.SET_PLAYING, payload: true });
        
        // 开始 TTS
        japaneseTTS.speak(text, {
          rate: state.playbackRate || 0.85,
          pitch: 1,
          onStart: () => {
            dispatch({ type: ActionTypes.SET_PLAYING, payload: true });
          },
          onEnd: () => {
            dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
            dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: 0 });
          },
          onError: (error) => {
            console.error('TTS Error:', error);
            dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
          }
        });

        // 模拟时间更新
        const estimatedDuration = japaneseTTS.estimateDuration(text, state.playbackRate || 0.85);
        ttsIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - ttsStartTimeRef.current) / 1000;
          if (elapsed < estimatedDuration) {
            dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: elapsed });
          } else {
            clearInterval(ttsIntervalRef.current);
          }
        }, 100);
      });
    } else if (audioRef.current) {
      audioRef.current.play();
    }
  }, [isTTS, text, state.playbackRate, dispatch]);

  const pause = useCallback(() => {
    if (isTTS) {
      japaneseTTS.stop();
      clearInterval(ttsIntervalRef.current);
      dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isTTS, dispatch]);

  const stop = useCallback(() => {
    if (isTTS) {
      japaneseTTS.stop();
      clearInterval(ttsIntervalRef.current);
      dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: 0 });
      dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isTTS, dispatch]);

  const seek = useCallback((time) => {
    // TTS 模式下 seek 功能有限，主要是重播
    if (isTTS) {
      japaneseTTS.stop();
      clearInterval(ttsIntervalRef.current);
      dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: 0 });
      play(); // 重新开始
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, [isTTS, play, dispatch]);

  const setRate = useCallback((rate) => {
    if (isTTS) {
      // TTS 模式下重新开始以应用新速率
      if (state.isPlaying) {
        pause();
        play();
      }
    } else if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    dispatch({ type: ActionTypes.SET_PLAYBACK_RATE, payload: rate });
  }, [isTTS, state.isPlaying, pause, play, dispatch]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  return {
    audioRef,
    waveformData,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: isTTS ? duration : (audioRef.current?.duration || duration || 120),
    playbackRate: state.playbackRate,
    isTTS,
    play,
    pause,
    stop,
    seek,
    setRate,
    togglePlay,
  };
}

export default useAudioPlayer;
