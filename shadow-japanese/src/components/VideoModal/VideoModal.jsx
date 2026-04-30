import { useEffect, useState } from 'react';
import styles from './VideoModal.module.css';

function VideoModal({ anime, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // 获取YouTube视频ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const trailerUrl = anime.trailer?.url || anime.streaming?.[0]?.url;
  const videoId = getYouTubeId(trailerUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;

  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        {embedUrl ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={embedUrl}
              title={`${anime.title} 预告片`}
              className={styles.video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className={styles.noVideo}>
            <p>暂无预告片可用</p>
            <p className={styles.hint}>可以观看视频网站上的完整版</p>
          </div>
        )}
        
        <button 
          className={styles.detailsToggle}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '收起详情 ▲' : '查看详情 ▼'}
        </button>
        
        {showDetails && (
          <div className={styles.details}>
            <h2 className={styles.title}>{anime.title}</h2>
            {anime.titleJapanese && (
              <p className={styles.japaneseTitle}>{anime.titleJapanese}</p>
            )}
            
            <div className={styles.meta}>
              {anime.score && (
                <span className={styles.score}>⭐ {anime.score}</span>
              )}
              {anime.type && <span className={styles.type}>{anime.type}</span>}
              {anime.episodes && <span>📺 {anime.episodes}集</span>}
              {anime.duration && <span>⏱ {anime.duration}</span>}
              {anime.year && <span>📅 {anime.year}</span>}
            </div>
            
            {anime.genres?.length > 0 && (
              <div className={styles.genres}>
                {anime.genres.map((genre, i) => (
                  <span key={i} className={styles.genre}>{genre}</span>
                ))}
              </div>
            )}
            
            {anime.studios?.length > 0 && (
              <p className={styles.studio}>🏢 制作：{anime.studios.join(', ')}</p>
            )}
            
            {anime.synopsis && (
              <div className={styles.synopsis}>
                <h4>简介</h4>
                <p>{anime.synopsis}</p>
              </div>
            )}
            
            <div className={styles.learning}>
              <h4>🎓 学习提示</h4>
              <ul>
                <li>观看预告片，注意角色对话的语速和语调</li>
                <li>尝试不看字幕理解内容</li>
                <li>记录不懂的词汇和语法</li>
                <li>可以反复观看同一片段练习听力</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoModal;
