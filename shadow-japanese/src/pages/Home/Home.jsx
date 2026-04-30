import { useState, useEffect } from 'react';
import { useApp, ActionTypes } from '../../context/AppContext';
import { getDailyContents } from '../../data/contents';
import ContentCard from '../../components/ContentCard';
import styles from './Home.module.css';

function Home() {
  const { state, dispatch } = useApp();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      const dailyContents = getDailyContents();
      setContents(dailyContents);
      setLoading(false);
    }, 300);
  }, []);
  
  const handleCardClick = (content) => {
    dispatch({ type: ActionTypes.SET_CURRENT_CONTENT, payload: content });
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: 'practice' });
  };
  
  // 计算今日完成数
  const today = new Date().toISOString().split('T')[0];
  const completedToday = contents.filter(c => 
    state.completedContents[c.id]?.date === today
  ).length;
  
  // 格式化日期
  const formatDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date().toLocaleDateString('zh-CN', options);
  };
  
  if (loading) {
    return (
      <div className={styles.home}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>加载中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <p className={styles.date}>{formatDate()}</p>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🌸</span>
          今日日语
        </h1>
        <p className={styles.goal}>
          今日目标：<span className={styles.goalHighlight}>{completedToday}/{contents.length}</span> 篇
        </p>
      </div>
      
      {contents.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <p>暂无内容</p>
        </div>
      ) : (
        <div className={styles.contentList}>
          {contents.map(content => (
            <ContentCard 
              key={content.id} 
              content={content}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
