import { useState } from 'react';
import Waveform from '../Waveform';
import styles from './Recorder.module.css';

function Recorder({
  isRecording,
  recordingDuration,
  recordedUrl,
  waveformData,
  onStart,
  onStop,
  onSave,
}) {
  const [playingSource, setPlayingSource] = useState(null);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handlePlayRecorded = () => {
    if (!recordedUrl) return;
    
    if (playingSource) {
      playingSource.pause();
      setPlayingSource(null);
    } else {
      const audio = new Audio(recordedUrl);
      audio.play();
      setPlayingSource(audio);
      audio.onended = () => setPlayingSource(null);
    }
  };
  
  return (
    <div className={styles.recorder}>
      <div className={styles.header}>
        <h3 className={styles.title}>影子跟读录音</h3>
        <span className={styles.duration}>{formatDuration(recordingDuration)}</span>
      </div>
      
      {/* 实时波形 */}
      {isRecording && (
        <Waveform 
          isLive={true} 
          liveData={waveformData} 
          label="实时录音波形"
        />
      )}
      
      {/* 录音按钮 */}
      <button
        className={`${styles.recordButton} ${isRecording ? styles.recording : styles.idle}`}
        onClick={isRecording ? onStop : onStart}
      >
        <span className={styles.recordIcon}>
          {isRecording ? '⏹' : '🎤'}
        </span>
      </button>
      
      <p className={styles.hint}>
        {isRecording 
          ? '正在录音... 点击停止' 
          : '点击开始录音，模仿音频进行跟读练习'}
      </p>
      
      {/* 操作按钮 */}
      {recordedUrl && (
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={onSave}
          >
            <span>✓</span>
            <span>保存录音</span>
          </button>
          <button 
            className={`${styles.actionButton} ${styles.secondary}`}
            onClick={handlePlayRecorded}
          >
            <span>{playingSource ? '⏸' : '▶'}</span>
            <span>回听</span>
          </button>
        </div>
      )}
      
      {/* 录音预览 */}
      <audio className={styles.audioPreview} controls src={recordedUrl} />
    </div>
  );
}

export default Recorder;
