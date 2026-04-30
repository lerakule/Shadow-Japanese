import { useState, useEffect } from 'react';
import { useApp, ActionTypes } from '../../context/AppContext';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import useRecorder from '../../hooks/useRecorder';
import AudioPlayer from '../../components/AudioPlayer';
import Recorder from '../../components/Recorder';
import Waveform from '../../components/Waveform';
import styles from './Practice.module.css';

function Practice() {
  const { state, dispatch } = useApp();
  const [showTranslation, setShowTranslation] = useState(false);
  const [originalWaveform, setOriginalWaveform] = useState([]);
  const [recordedWaveform, setRecordedWaveform] = useState([]);
  
  const content = state.currentContent;
  
  // 使用音频播放器
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    waveformData,
    play,
    pause,
    seek,
    setRate,
  } = useAudioPlayer(content?.audioUrl);
  
  // 使用录音器
  const {
    isRecording,
    recordingDuration,
    recordedUrl,
    waveformData: recordingWaveform,
    startRecording,
    stopRecording,
    saveRecording,
  } = useRecorder(content?.id);
  
  // 生成模拟原音波形（因为内置音频可能不存在）
  useEffect(() => {
    if (content && originalWaveform.length === 0) {
      const mockData = Array(100).fill(0).map(() => Math.random() * 0.6 + 0.4);
      setOriginalWaveform(mockData);
    }
  }, [content]);
  
  // 获取录音波形用于复盘
  useEffect(() => {
    if (recordedUrl && recordedWaveform.length > 0) {
      const latestWaveform = recordingWaveform[recordingWaveform.length - 1] || [];
      setRecordedWaveform(latestWaveform);
    }
  }, [recordedUrl, recordingWaveform]);
  
  const handleSaveRecording = () => {
    const record = saveRecording();
    if (record) {
      // 生成录音波形数据
      const mockRecordWaveform = Array(100).fill(0).map(() => Math.random() * 0.7 + 0.3);
      setRecordedWaveform(mockRecordWaveform);
    }
  };
  
  const handleComplete = () => {
    if (content) {
      dispatch({ type: ActionTypes.MARK_CONTENT_COMPLETED, payload: content.id });
    }
  };
  
  const handleBack = () => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: 'home' });
  };
  
  if (!content) {
    return (
      <div className={styles.practice}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📖</div>
          <p className={styles.emptyText}>请先选择要练习的内容</p>
          <button className={styles.backButton} onClick={handleBack}>
            ← 返回首页
          </button>
        </div>
      </div>
    );
  }
  
  const isCompleted = state.completedContents[content.id]?.completed;
  
  return (
    <div className={styles.practice}>
      {/* 返回按钮 */}
      <button className={styles.backButton} onClick={handleBack}>
        ← 返回首页
      </button>
      
      {/* 内容展示 */}
      <div className={styles.contentSection}>
        <div className={styles.contentHeader}>
          <h2 className={styles.contentTitle}>{content.title}</h2>
          <span className={styles.contentBadge}>{content.difficulty}</span>
        </div>
        
        <div className={styles.contentBody}>
          {content.body}
        </div>
        
        <button 
          className={styles.toggleTranslation}
          onClick={() => setShowTranslation(!showTranslation)}
        >
          {showTranslation ? '🙈 隐藏翻译' : '👀 显示翻译'}
        </button>
        
        {showTranslation && (
          <div className={styles.translation}>
            {content.bodyCn}
          </div>
        )}
      </div>
      
      {/* 音频播放 */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🔊</span>
        <span>音频播放</span>
      </div>
      <AudioPlayer
        audioUrl={content.audioUrl}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration || content.duration}
        playbackRate={playbackRate}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
        onRateChange={setRate}
        waveformData={waveformData.length > 0 ? waveformData : originalWaveform}
      />
      
      {/* 录音跟读 */}
      <div className={styles.practiceSection}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🎤</span>
          <span>影子跟读</span>
        </div>
        <Recorder
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          recordedUrl={recordedUrl}
          waveformData={recordingWaveform}
          onStart={startRecording}
          onStop={stopRecording}
          onSave={handleSaveRecording}
        />
      </div>
      
      {/* 复盘对比 */}
      {(recordedUrl || recordedWaveform.length > 0) && (
        <div className={styles.reviewPanel}>
          <h3 className={styles.reviewTitle}>📊 波形对比复盘</h3>
          
          <div className={styles.comparisonSection}>
            <Waveform 
              data={originalWaveform}
              label="原音波形"
              color="#636E72"
            />
            <Waveform 
              data={recordedWaveform}
              label="你的录音波形"
              color="#E17055"
            />
          </div>
        </div>
      )}
      
      {/* 完成按钮 */}
      <button 
        className={styles.completeButton}
        onClick={handleComplete}
        disabled={isCompleted}
      >
        {isCompleted ? '✓ 已完成' : '完成练习'}
      </button>
    </div>
  );
}

export default Practice;
