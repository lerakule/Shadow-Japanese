import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp, ActionTypes } from '../context/AppContext';
import { japaneseTTS } from '../utils/tts';

// 音频播放器 Hook - 支持 TTS 和真实音频
export function useAudioPlayer(audioUrl, text = '') {
  const { state, dispatch } = useApp();
  const audioRef = useRef(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isTTS, setIsTTS] = useState(false);
  const [useExternalAudio, setUseExternalAudio] = useState(false);
  const ttsIntervalRef = useRef(null);
  const ttsStartTimeRef = useRef(0);

  useEffect(() => {
    if (!audioUrl && !text) return;

    // 判断音频类型
    const isTTSMode = audioUrl === 'tts' || !audioUrl || audioUrl.startsWith('/audio/');
    const isExternalUrl = audioUrl && (
      audioUrl.startsWith('http') || 
      audioUrl.startsWith('//') ||
      audioUrl.endsWith('.mp3')
    );

    setIsTTS(isTTSMode);
    setUseExternalAudio(isExternalUrl);

    if (isExternalUrl) {
      // 外部音频URL（NHK等）
      const audio = new Audio(audioUrl);
      audio.preload = 'metadata';
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('canplay', () => {
        setDuration(audio.duration);
        // 生成波形数据
        generateWaveformFromAudio(audio);
      });

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
    } else if (!isTTSMode) {
      // 内置音频文件
      setWaveformData(Array(100).fill(0).map(() => Math.random() * 0.8 + 0.2));
      setDuration(120);
    }
  }, [audioUrl, dispatch]);

  // 从音频生成波形数据
  const generateWaveformFromAudio = async (audio) => {
    try {
      // 由于CORS限制，这里使用模拟波形
      setWaveformData(Array(100).fill(0).map(() => Math.random() * 0.6 + 0.4));
    } catch (error) {
      console.log('Using simulated waveform for external audio');
      setWaveformData(Array(100).fill(0).map(() => Math.random() * 0.6 + 0.4));
    }
  };

  const play = useCallback(() => {
    if (useExternalAudio && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Audio play failed:', err);
        // 如果外部音频播放失败，回退到TTS
        playFallbackTTS();
      });
    } else if (isTTS && text) {
      playFallbackTTS();
    } else if (audioRef.current) {
      audioRef.current.play();
    }
  }, [isTTS, text, useExternalAudio]);

  const playFallbackTTS = () => {
    ttsStartTimeRef.current = Date.now();
    
    japaneseTTS.init().then(() => {
      dispatch({ type: ActionTypes.SET_PLAYING, payload: true });
      
      japaneseTTS.speak(text || '音声を再生しています', {
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
  };

  const pause = useCallback(() => {
    if (useExternalAudio || (audioRef.current && !isTTS)) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      japaneseTTS.stop();
      clearInterval(ttsIntervalRef.current);
    }
    dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
  }, [isTTS, useExternalAudio, dispatch]);

  const stop = useCallback(() => {
    if (useExternalAudio || (audioRef.current && !isTTS)) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      japaneseTTS.stop();
      clearInterval(ttsIntervalRef.current);
    }
    dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: 0 });
    dispatch({ type: ActionTypes.SET_PLAYING, payload: false });
  }, [isTTS, useExternalAudio, dispatch]);

  const seek = useCallback((time) => {
    if (useExternalAudio && audioRef.current) {
      audioRef.current.currentTime = time;
    } else if (isTTS) {
      japaneseTTS.stop();
      clearInterval(ttsIntervalRef.current);
      dispatch({ type: ActionTypes.SET_CURRENT_TIME, payload: 0 });
      playFallbackTTS();
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, [isTTS, useExternalAudio, playFallbackTTS, dispatch]);

  const setRate = useCallback((rate) => {
    if (useExternalAudio && audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    dispatch({ type: ActionTypes.SET_PLAYBACK_RATE, payload: rate });
  }, [useExternalAudio, dispatch]);

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
    duration: useExternalAudio ? duration : (duration || 120),
    playbackRate: state.playbackRate,
    isTTS,
    useExternalAudio,
    play,
    pause,
    stop,
    seek,
    setRate,
    togglePlay,
  };
}

export default useAudioPlayer;
