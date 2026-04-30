import { useRef } from 'react';
import { useApp, ActionTypes } from '../../context/AppContext';
import { contents } from '../../data/contents';
import Calendar from '../../components/Calendar';
import styles from './MyProgress.module.css';

function MyProgress() {
  const { state, dispatch, exportData, importData, getStreak } = useApp();
  const fileInputRef = useRef(null);
  
  const streak = getStreak();
  const totalRecords = state.practiceRecords.length;
  const totalCompleted = Object.keys(state.completedContents).filter(
    id => state.completedContents[id]?.completed
  ).length;
  
  // 获取内容标题
  const getContentTitle = (contentId) => {
    const content = contents.find(c => c.id === contentId);
    return content?.title || '未知内容';
  };
  
  // 格式化日期
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 处理导入
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    const success = importData(text);
    
    if (success) {
      alert('数据导入成功！');
    } else {
      alert('数据导入失败，请检查文件格式。');
    }
    
    // 清空 input
    e.target.value = '';
  };
  
  // 清除数据
  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      dispatch({ type: ActionTypes.CLEAR_DATA });
      alert('数据已清除。');
    }
  };
  
  return (
    <div className={styles.progress}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>📊</span>
          我的进度
        </h1>
        <p className={styles.subtitle}>
          已完成 {totalCompleted} 篇 · 录音 {totalRecords} 条
        </p>
      </div>
      
      {/* 打卡日历 */}
      <div className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📅</span>
          完成日历
        </h2>
        <Calendar />
      </div>
      
      {/* 录音历史 */}
      <div className={styles.historySection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🎙️</span>
          录音历史
        </h2>
        
        {state.practiceRecords.length === 0 ? (
          <div className={styles.emptyRecords}>
            <div className={styles.emptyIcon}>🎤</div>
            <p>暂无录音记录</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              完成练习后会自动保存录音
            </p>
          </div>
        ) : (
          <div className={styles.recordList}>
            {state.practiceRecords.slice(0, 10).map(record => (
              <div key={record.id} className={styles.recordItem}>
                <span className={styles.recordIcon}>🎵</span>
                <div className={styles.recordInfo}>
                  <div className={styles.recordTitle}>{getContentTitle(record.contentId)}</div>
                  <div className={styles.recordMeta}>
                    <span>{formatDate(record.date)}</span>
                    <span>{Math.floor(record.duration || 0)}秒</span>
                  </div>
                </div>
                <div className={styles.recordActions}>
                  <button className={styles.recordButton} title="播放">▶</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 数据管理 */}
      <div className={styles.dataSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>💾</span>
          数据管理
        </h2>
        
        <div className={styles.dataButtons}>
          <button className={`${styles.dataButton} ${styles.export}`} onClick={exportData}>
            <span>📤</span>
            <span>导出备份</span>
          </button>
          <button className={`${styles.dataButton} ${styles.import}`} onClick={handleImportClick}>
            <span>📥</span>
            <span>导入数据</span>
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <button className={styles.clearButton} onClick={handleClearData}>
          清除所有数据
        </button>
      </div>
    </div>
  );
}

export default MyProgress;
