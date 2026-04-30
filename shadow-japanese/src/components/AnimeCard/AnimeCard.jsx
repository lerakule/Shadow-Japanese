import styles from './AnimeCard.module.css';

function AnimeCard({ anime, onClick, onPlayTrailer }) {
  const hasTrailer = anime.trailer?.url || anime.streaming?.[0]?.url;
  
  // 获取评分颜色
  const getScoreColor = (score) => {
    if (score >= 8.5) return '#4CAF50';
    if (score >= 7.5) return '#8BC34A';
    if (score >= 6.5) return '#FFC107';
    if (score >= 5.5) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img 
          src={anime.coverImage} 
          alt={anime.title}
          className={styles.image}
          loading="lazy"
        />
        {anime.score && (
          <div 
            className={styles.score}
            style={{ backgroundColor: getScoreColor(anime.score) }}
          >
            ⭐ {anime.score}
          </div>
        )}
        {anime.type && (
          <div className={styles.type}>{anime.type}</div>
        )}
        {hasTrailer && (
          <button 
            className={styles.playButton}
            onClick={onPlayTrailer}
            title="播放预告片"
          >
            ▶
          </button>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title} title={anime.title}>
          {anime.title}
        </h3>
        {anime.titleJapanese && anime.titleJapanese !== anime.title && (
          <p className={styles.japaneseTitle}>{anime.titleJapanese}</p>
        )}
        
        <div className={styles.meta}>
          {anime.episodes && (
            <span className={styles.metaItem}>
              📺 {anime.episodes}集
            </span>
          )}
          {anime.year && (
            <span className={styles.metaItem}>
              📅 {anime.year}
            </span>
          )}
        </div>
        
        {anime.genres?.length > 0 && (
          <div className={styles.genres}>
            {anime.genres.slice(0, 2).map((genre, index) => (
              <span key={index} className={styles.genre}>
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeCard;
