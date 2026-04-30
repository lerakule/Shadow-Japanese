import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp, ActionTypes } from '../context/AppContext';

// 录音 Hook
export function useRecorder(contentId) {
  const { dispatch } = useApp();
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const chunksRef = useRef([]);
  const animationRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  
  // 开始录音
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 创建 MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      
      // 创建音频分析器用于波形
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // 开始录音
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);
      dispatch({ type: ActionTypes.SET_RECORDING, payload: true });
      
      // 更新时长
      const startTime = Date.now();
      const updateDuration = () => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
        animationRef.current = requestAnimationFrame(updateDuration);
      };
      updateDuration();
      
      // 更新波形数据
      const updateWaveform = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // 每帧取部分数据
        const samples = 50;
        const step = Math.floor(dataArray.length / samples);
        const filtered = [];
        for (let i = 0; i < samples; i++) {
          filtered.push(dataArray[i * step] / 255);
        }
        setWaveformData(prev => [...prev.slice(-99), filtered]);
        
        if (isRecording) {
          requestAnimationFrame(updateWaveform);
        }
      };
      updateWaveform();
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('无法访问麦克风，请检查权限设置。');
    }
  }, [dispatch, isRecording]);
  
  // 停止录音
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      dispatch({ type: ActionTypes.SET_RECORDING, payload: false });
      cancelAnimationFrame(animationRef.current);
    }
  }, [isRecording, dispatch]);
  
  // 录音对比波形（用于复盘）
  const getComparisonWaveform = useCallback(async () => {
    if (!recordedBlob) return [];
    
    try {
      const arrayBuffer = await recordedBlob.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
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
      
      const maxVal = Math.max(...filteredData);
      const normalized = filteredData.map(d => d / maxVal);
      
      await audioContext.close();
      return normalized;
    } catch (error) {
      console.error('Failed to analyze recording:', error);
      return [];
    }
  }, [recordedBlob]);
  
  // 保存录音
  const saveRecording = useCallback(() => {
    if (!recordedBlob || !contentId) return null;
    
    const record = {
      id: `record-${Date.now()}`,
      contentId,
      date: new Date().toISOString(),
      audioBlob: recordedBlob,
      duration: recordingDuration,
    };
    
    dispatch({ type: ActionTypes.ADD_PRACTICE_RECORD, payload: record });
    return record;
  }, [recordedBlob, contentId, recordingDuration, dispatch]);
  
  // 清理
  useEffect(() => {
    return () => {
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [recordedUrl]);
  
  return {
    isRecording,
    recordingDuration,
    recordedBlob,
    recordedUrl,
    waveformData,
    startRecording,
    stopRecording,
    getComparisonWaveform,
    saveRecording,
  };
}

export default useRecorder;
