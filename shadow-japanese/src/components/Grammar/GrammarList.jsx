import { useState } from 'react';
import styles from './Grammar.module.css';

function GrammarList({ grammars = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  if (grammars.length === 0) {
    return (
      <div className={styles.grammarList}>
        <p style={{ textAlign: 'center', color: 'var(--color-secondary)', padding: '20px' }}>
          暂无语法点
        </p>
      </div>
    );
  }
  
  return (
    <div className={styles.grammarList}>
      {grammars.map((grammar, index) => (
        <div key={index} className={styles.grammarItem}>
          <div 
            className={styles.grammarHeader}
            onClick={() => handleToggle(index)}
          >
            <span className={styles.grammarPattern}>{grammar.pattern}</span>
            <span className={`${styles.expandIcon} ${expandedIndex === index ? styles.expanded : ''}`}>
              ▼
            </span>
          </div>
          
          <div className={`${styles.grammarDetail} ${expandedIndex === index ? styles.expanded : ''}`}>
            <div className={styles.detailSection}>
              <div className={styles.detailLabel}>含义</div>
              <div className={styles.detailContent}>{grammar.meaning}</div>
            </div>
            
            {grammar.formation && (
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>接续</div>
                <div className={styles.detailContent}>{grammar.formation}</div>
              </div>
            )}
            
            {grammar.examples && grammar.examples.length > 0 && (
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>例句</div>
                <div className={styles.exampleList}>
                  {grammar.examples.map((example, i) => (
                    <div key={i} className={styles.example}>{example}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GrammarList;
