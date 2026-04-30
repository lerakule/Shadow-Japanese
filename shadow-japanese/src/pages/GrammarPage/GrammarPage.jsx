import { useState, useEffect } from 'react';
import { getDailyContents } from '../../data/contents';
import GrammarList from '../../components/Grammar';
import styles from './GrammarPage.module.css';

function GrammarPage() {
  const [contents, setContents] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  
  useEffect(() => {
    const dailyContents = getDailyContents();
    setContents(dailyContents);
    if (dailyContents.length > 0 && !selectedContentId) {
      setSelectedContentId(dailyContents[0].id);
    }
  }, []);
  
  const selectedContent = contents.find(c => c.id === selectedContentId);
  
  return (
    <div className={styles.grammarPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>📖</span>
          语法精讲
        </h1>
        <p className={styles.subtitle}>选择文章，查看语法点详解</p>
      </div>
      
      {/* 内容选择 */}
      <div className={styles.contentSelector}>
        <p className={styles.selectorLabel}>选择文章：</p>
        <div className={styles.contentList}>
          {contents.map(content => (
            <div
              key={content.id}
              className={`${styles.contentOption} ${selectedContentId === content.id ? styles.selected : ''}`}
              onClick={() => setSelectedContentId(content.id)}
            >
              <span className={styles.contentTitle}>{content.title}</span>
              <span className={styles.badge}>{content.difficulty}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 语法列表 */}
      {selectedContent && (
        <div className={styles.grammarSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📝</span>
            {selectedContent.title} - 语法点
          </h2>
          <GrammarList grammars={selectedContent.grammars} />
          
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <span>
              提示：点击语法卡片展开查看详细解释和例句。
              结合音频练习，加深对语法结构的理解。
            </span>
          </div>
        </div>
      )}
      
      {!selectedContent && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <p>暂无语法内容</p>
        </div>
      )}
    </div>
  );
}

export default GrammarPage;
