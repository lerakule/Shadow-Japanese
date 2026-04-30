import { useApp } from '../../context/AppContext';
import styles from './ContentCard.module.css';

function ContentCard({ content, onClick }) {
  const { state } = useApp();
  const isCompleted = state.completedContents[content.id]?.completed;
  const isNHK = content.category === 'NHKニュース';
  
  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCategoryLabel = () => {
    if (isNHK) return 'NHK';
    const labels = {
      news: '新闻',
      anime: '动漫',
      drama: '影视',
      社会: '社会',
      科技: '科技',
      文化: '文化',
      国际: '国际',
      环境: '环境',
    };
    return labels[content.category] || content.category;
  };
  
  const getDifficultyClass = () => {
    return styles[content.difficulty?.toLowerCase()] || '';
  };

  return (
    <div 
      className={`${styles.card} ${isCompleted ? styles.completed : ''} ${isNHK ? styles.nhkCard : ''}`}
      onClick={() => onClick(content)}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{content.title}</h3>
        <span className={`${styles.badge} ${getDifficultyClass()}`}>
          {content.difficulty}
        </span>
      </div>
      
      <div className={styles.meta}>
        <span className={`${styles.badge} ${styles[content.category] || ''} ${isNHK ? styles.nhkBadge : ''}`}>
          {isNHK && '📻 '}
          {getCategoryLabel()}
        </span>
        <span className={styles.metaItem}>
          <span>⏱</span>
          <span>{formatDuration(content.duration)}</span>
        </span>
        {content.hasAudio && (
          <span className={styles.metaItem}>
            <span>🔊</span>
            <span>有音频</span>
          </span>
        )}
        {content.grammars && (
          <span className={styles.metaItem}>
            <span>📝</span>
            <span>{content.grammars.length} 个语法点</span>
          </span>
        )}
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
