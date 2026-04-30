import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp, ActionTypes } from '../context/AppContext';

// 音频播放器 Hook
export function useAudioPlayer(audioUrl) {
  const { state, dispatch } = useApp();
  const audioRef = useRef(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  
  useEffect(() => {
    if (!audioUrl) return;
    
    // 创建音频元素
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    audioRef.current = audio;
    
    // 加载音频数据用于波形
    const loadAudioData = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // 提取波形数据
        const rawData = decodedBuffer.getChannelData(0);
        const samples = 100; // 采样点数
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
        console.error('Failed to load audio data:', error);
        // 生成模拟波形数据
        setWaveformData(Array(100).fill(0).map(() => Math.random() * 0.8 + 0.2));
      }
    };
    
    loadAudioData();
    
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
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, dispatch]);
  
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);
  
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);
  
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);
  
  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);
  
  const setRate = useCallback((rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      dispatch({ type: ActionTypes.SET_PLAYBACK_RATE, payload: rate });
    }
  }, [dispatch]);
  
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
    duration: audioRef.current?.duration || 0,
    playbackRate: state.playbackRate,
    play,
    pause,
    stop,
    seek,
    setRate,
    togglePlay,
  };
}

export default useAudioPlayer;
