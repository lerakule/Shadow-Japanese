import { useApp } from '../../context/AppContext';
import styles from './ContentCard.module.css';

function ContentCard({ content, onClick }) {
  const { state } = useApp();
  const isCompleted = state.completedContents[content.id]?.completed;
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCategoryLabel = () => {
    const labels = {
      news: '新闻',
      anime: '动漫',
      drama: '影视'
    };
    return labels[content.category] || content.category;
  };
  
  const getDifficultyClass = () => {
    return styles[content.difficulty.toLowerCase()] || '';
  };
  
  return (
    <div 
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
      onClick={() => onClick(content)}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{content.title}</h3>
        <span className={`${styles.badge} ${getDifficultyClass()}`}>
          {content.difficulty}
        </span>
      </div>
      
      <div className={styles.meta}>
        <span className={`${styles.badge} ${styles[content.category]}`}>
          {getCategoryLabel()}
        </span>
        <span className={styles.metaItem}>
          <span>⏱</span>
          <span>{formatDuration(content.duration)}</span>
        </span>
        <span className={styles.metaItem}>
          <span>📝</span>
          <span>{content.grammars.length} 个语法点</span>
        </span>
      </div>
      
      <p className={styles.preview}>
        {content.body.split('\n')[0]}
      </p>
      
      <div className={styles.footer}>
        <span className={`${styles.status} ${isCompleted ? '' : styles.pending}`}>
          {isCompleted ? '✓ 已完成' : '○ 待练习'}
        </span>
        <span className={styles.arrow}>›</span>
      </div>
    </div>
  );
}

export default ContentCard;
