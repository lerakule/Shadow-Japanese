import { useState, useEffect } from 'react';
import { useApp, ActionTypes } from '../../context/AppContext';
import { getDailyContents } from '../../data/contents';
import { fetchNHKNewsList } from '../../data/nhkApi';
import ContentCard from '../../components/ContentCard';
import styles from './Home.module.css';

function Home() {
  const { state, dispatch } = useApp();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [contentSource, setContentSource] = useState('builtin'); // 'builtin' | 'nhk'
  
  // 加载内置内容
  const loadBuiltinContents = () => {
    setLoading(true);
    setTimeout(() => {
      const dailyContents = getDailyContents();
      setContents(dailyContents);
      setContentSource('builtin');
      setLoading(false);
    }, 300);
  };

  // 加载NHK新闻
  const loadNHKNews = async () => {
    setNewsLoading(true);
    try {
      const news = await fetchNHKNewsList();
      if (news.length > 0) {
        setContents(news);
        setContentSource('nhk');
      } else {
        // 如果NHK加载失败，加载内置内容
        loadBuiltinContents();
      }
    } catch (error) {
      console.error('Failed to load NHK news:', error);
      loadBuiltinContents();
    }
    setNewsLoading(false);
  };

  useEffect(() => {
    loadBuiltinContents();
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

  if (loading && !newsLoading) {
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
        
        {/* 内容源切换 */}
        <div className={styles.sourceSwitch}>
          <span className={styles.sourceLabel}>内容来源：</span>
          <button 
            className={`${styles.sourceButton} ${contentSource === 'builtin' ? styles.active : ''}`}
            onClick={loadBuiltinContents}
          >
            📚 内置课程
          </button>
          <button 
            className={`${styles.sourceButton} ${contentSource === 'nhk' ? styles.active : ''}`}
            onClick={loadNHKNews}
            disabled={newsLoading}
          >
            {newsLoading ? '⏳ 加载中...' : '📰 NHK新闻'}
          </button>
        </div>
        
        {contentSource === 'nhk' && (
          <p className={styles.sourceHint}>
            📻 实时日语新闻，带音频，N3-N2难度
          </p>
        )}
      </div>
      
      {newsLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>正在获取NHK新闻...</p>
        </div>
      ) : contents.length === 0 ? (
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
