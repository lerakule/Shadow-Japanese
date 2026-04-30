import { useRef, useEffect } from 'react';
import styles from './Waveform.module.css';

function Waveform({ 
  data = [], 
  label, 
  color = '#E17055',
  isLive = false,
  liveData = []
}) {
  const canvasRef = useRef(null);
  
  // 绘制静态波形
  useEffect(() => {
    if (isLive || data.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const barWidth = width / data.length;
    
    ctx.clearRect(0, 0, width, height);
    
    data.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * height * 0.85;
      const y = (height - barHeight) / 2;
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [data, color, isLive]);
  
  // 实时录音波形
  const renderLiveWaveform = () => {
    const latestData = liveData[liveData.length - 1] || [];
    
    return (
      <div className={styles.recordingWaveform}>
        {latestData.map((value, index) => (
          <div
            key={index}
            className={styles.bar}
            style={{ height: `${Math.max(4, value * 60)}px` }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className={styles.waveformContainer}>
      {label && (
        <div className={styles.label}>
          <span className={styles.labelIcon}>
            {isLive ? '🔴' : '🎵'}
          </span>
          <span>{label}</span>
        </div>
      )}
      
      {isLive ? (
        renderLiveWaveform()
      ) : (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}
    </div>
  );
}

export default Waveform;
