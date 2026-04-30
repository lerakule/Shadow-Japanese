import { useApp } from '../../context/AppContext';
import styles from './TabBar.module.css';

const tabs = [
  { id: 'home', label: '素材', icon: '📚' },
  { id: 'practice', label: '跟读', icon: '🎤' },
  { id: 'grammar', label: '语法', icon: '📖' },
  { id: 'progress', label: '我的', icon: '📊' },
];

function TabBar() {
  const { state, dispatch } = useApp();
  
  const handleTabClick = (tabId) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  };
  
  return (
    <nav className={styles.tabbar}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${state.activeTab === tab.id ? styles.active : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default TabBar;
