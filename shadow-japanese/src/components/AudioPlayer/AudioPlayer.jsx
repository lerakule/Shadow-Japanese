import { useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

const PLAYBACK_RATES = [0.5, 0.75, 1];

function AudioPlayer({ 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration,
  playbackRate, 
  onPlay, 
  onPause, 
  onSeek, 
  onRateChange,
  waveformData = [] 
}) {
  const canvasRef = useRef(null);
  
  // 绘制波形
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const barWidth = width / waveformData.length;
    const progress = duration > 0 ? currentTime / duration : 0;
    
    ctx.clearRect(0, 0, width, height);
    
    waveformData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * height * 0.8;
      const y = (height - barHeight) / 2;
      
      // 根据播放进度着色
      const isPlayed = index / waveformData.length < progress;
      ctx.fillStyle = isPlayed ? '#E17055' : '#DFE6E9';
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [waveformData, currentTime, duration]);
  
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleCanvasClick = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    onSeek(progress * duration);
  };
  
  return (
    <div className={styles.player}>
      {/* 波形显示 */}
      <div className={styles.waveform} onClick={handleCanvasClick}>
        <canvas ref={canvasRef} className={styles.waveformCanvas} />
        <div 
          className={styles.progressBar}
          style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
        />
      </div>
      
      {/* 控制按钮 */}
      <div className={styles.controls}>
        <button 
          className={styles.playButton}
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className={styles.timeDisplay}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        {/* 播放速度 */}
        <div className={styles.rateSelector}>
          {PLAYBACK_RATES.map(rate => (
            <button
              key={rate}
              className={`${styles.rateButton} ${playbackRate === rate ? styles.active : ''}`}
              onClick={() => onRateChange(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
