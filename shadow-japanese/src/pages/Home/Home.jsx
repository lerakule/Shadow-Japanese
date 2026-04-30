import { useState, useEffect } from 'react';
import { useApp, ActionTypes } from '../../context/AppContext';
import { getTopAnime, searchAnime, getSeasonalAnime } from '../../data/animeApi';
import AnimeCard from '../../components/AnimeCard';
import VideoModal from '../../components/VideoModal';
import styles from './Home.module.css';

function Home() {
  const { state, dispatch } = useApp();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState('top'); // 'top' | 'seasonal' | 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [error, setError] = useState(null);

  // 加载热门动漫
  const loadTopAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopAnime(1, 15);
      setAnimeList(data.anime);
      setContentType('top');
    } catch (err) {
      console.error('加载热门动漫失败:', err);
      setError('加载失败，请稍后重试');
    }
    setLoading(false);
  };

  // 加载当季动漫
  const loadSeasonalAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSeasonalAnime(1, 15);
      setAnimeList(data.anime);
      setContentType('seasonal');
    } catch (err) {
      console.error('加载当季动漫失败:', err);
      setError('加载失败，请稍后重试');
    }
    setLoading(false);
  };

  // 搜索动漫
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchAnime(searchQuery, 1);
      setAnimeList(data.anime);
      setContentType('search');
    } catch (err) {
      console.error('搜索失败:', err);
      setError('搜索失败，请稍后重试');
    }
    setLoading(false);
  };

  // 处理搜索输入
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // 执行搜索
  const executeSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
    }
  };

  // 按回车搜索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  useEffect(() => {
    loadTopAnime();
  }, []);

  // 当searchQuery变化时执行搜索
  useEffect(() => {
    if (searchQuery) {
      handleSearch({ preventDefault: () => {} });
    }
  }, [searchQuery]);

  const handleAnimeClick = (anime) => {
    setSelectedAnime(anime);
    dispatch({ type: ActionTypes.SET_CURRENT_CONTENT, payload: anime });
  };

  const handlePlayVideo = (anime, e) => {
    e?.stopPropagation();
    if (anime.trailer?.url || anime.streaming?.[0]?.url) {
      setSelectedAnime(anime);
      setShowVideoModal(true);
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedAnime(null);
  };

  // 格式化日期
  const formatDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date().toLocaleDateString('zh-CN', options);
  };

  const getTypeTitle = () => {
    switch (contentType) {
      case 'top': return '🏆 热门排行';
      case 'seasonal': return '📺 当季新番';
      case 'search': return `🔍 搜索结果: "${searchQuery}"`;
      default: return '🎬 动漫列表';
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <p className={styles.date}>{formatDate()}</p>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🎬</span>
          日语动漫学习
        </h1>
        <p className={styles.goal}>
          通过观看日语动漫学习地道表达 🎌
        </p>
        
        {/* 内容类型切换 */}
        <div className={styles.sourceSwitch}>
          <button 
            className={`${styles.sourceButton} ${contentType === 'top' ? styles.active : ''}`}
            onClick={loadTopAnime}
          >
            🏆 热门
          </button>
          <button 
            className={`${styles.sourceButton} ${contentType === 'seasonal' ? styles.active : ''}`}
            onClick={loadSeasonalAnime}
          >
            📺 当季
          </button>
        </div>
        
        {/* 搜索框 */}
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索动漫..."
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.searchButton}
            onClick={executeSearch}
          >
            🔍
          </button>
        </div>
        
        <p className={styles.sourceHint}>
          💡 点击卡片查看详情，播放预告片练习听力
        </p>
      </div>
      
      <h2 className={styles.sectionTitle}>{getTypeTitle()}</h2>
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>正在加载动漫列表...</p>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>😢</div>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={loadTopAnime}>
            重新加载
          </button>
        </div>
      ) : animeList.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>没有找到相关动漫</p>
        </div>
      ) : (
        <div className={styles.animeGrid}>
          {animeList.map(anime => (
            <AnimeCard 
              key={anime.id} 
              anime={anime}
              onClick={() => handleAnimeClick(anime)}
              onPlayTrailer={(e) => handlePlayVideo(anime, e)}
            />
          ))}
        </div>
      )}

      {/* 视频播放器模态框 */}
      {showVideoModal && selectedAnime && (
        <VideoModal 
          anime={selectedAnime}
          onClose={closeVideoModal}
        />
      )}
    </div>
  );
}

export default Home;
