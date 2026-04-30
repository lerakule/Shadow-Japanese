import { createContext, useContext, useReducer, useEffect } from 'react';

// 初始状态
const initialState = {
  // 当前选中的内容
  currentContent: null,
  
  // 用户进度
  completedContents: {}, // { contentId: { date, completed, timeSpent } }
  
  // 练习记录
  practiceRecords: [], // { id, contentId, date, audioData, duration }
  
  // 录音状态
  isRecording: false,
  recordingDuration: 0,
  
  // 播放状态
  isPlaying: false,
  currentTime: 0,
  playbackRate: 1,
  
  // 主题设置
  showTranslation: false,
  
  // 导航
  activeTab: 'home',
};

// Action 类型
const ActionTypes = {
  SET_CURRENT_CONTENT: 'SET_CURRENT_CONTENT',
  MARK_CONTENT_COMPLETED: 'MARK_CONTENT_COMPLETED',
  ADD_PRACTICE_RECORD: 'ADD_PRACTICE_RECORD',
  DELETE_PRACTICE_RECORD: 'DELETE_PRACTICE_RECORD',
  SET_RECORDING: 'SET_RECORDING',
  SET_RECORDING_DURATION: 'SET_RECORDING_DURATION',
  SET_PLAYING: 'SET_PLAYING',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_PLAYBACK_RATE: 'SET_PLAYBACK_RATE',
  TOGGLE_TRANSLATION: 'TOGGLE_TRANSLATION',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  LOAD_STATE: 'LOAD_STATE',
  EXPORT_DATA: 'EXPORT_DATA',
  IMPORT_DATA: 'IMPORT_DATA',
  CLEAR_DATA: 'CLEAR_DATA',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_CONTENT:
      return { ...state, currentContent: action.payload };
    
    case ActionTypes.MARK_CONTENT_COMPLETED:
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        completedContents: {
          ...state.completedContents,
          [action.payload]: { 
            date: today, 
            completed: true,
            completedAt: new Date().toISOString()
          }
        }
      };
    
    case ActionTypes.ADD_PRACTICE_RECORD:
      return {
        ...state,
        practiceRecords: [action.payload, ...state.practiceRecords]
      };
    
    case ActionTypes.DELETE_PRACTICE_RECORD:
      return {
        ...state,
        practiceRecords: state.practiceRecords.filter(r => r.id !== action.payload)
      };
    
    case ActionTypes.SET_RECORDING:
      return { ...state, isRecording: action.payload };
    
    case ActionTypes.SET_RECORDING_DURATION:
      return { ...state, recordingDuration: action.payload };
    
    case ActionTypes.SET_PLAYING:
      return { ...state, isPlaying: action.payload };
    
    case ActionTypes.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };
    
    case ActionTypes.SET_PLAYBACK_RATE:
      return { ...state, playbackRate: action.payload };
    
    case ActionTypes.TOGGLE_TRANSLATION:
      return { ...state, showTranslation: !state.showTranslation };
    
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case ActionTypes.LOAD_STATE:
      return { ...state, ...action.payload };
    
    case ActionTypes.CLEAR_DATA:
      return { 
        ...initialState,
        currentContent: state.currentContent,
        activeTab: state.activeTab
      };
    
    default:
      return state;
  }
}

// 创建 Context
const AppContext = createContext(null);

// LocalStorage 键名
const STORAGE_KEY = 'shadow-japanese-state';

// Provider 组件
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 从 LocalStorage 加载状态
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        dispatch({ type: ActionTypes.LOAD_STATE, payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load state from LocalStorage:', error);
    }
  }, []);
  
  // 保存状态到 LocalStorage
  useEffect(() => {
    try {
      const stateToSave = {
        completedContents: state.completedContents,
        practiceRecords: state.practiceRecords,
        showTranslation: state.showTranslation,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state to LocalStorage:', error);
    }
  }, [state.completedContents, state.practiceRecords, state.showTranslation]);
  
  // 导出数据
  const exportData = () => {
    const data = {
      completedContents: state.completedContents,
      practiceRecords: state.practiceRecords,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shadow-japanese-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // 导入数据
  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.completedContents) {
        Object.entries(data.completedContents).forEach(([contentId, record]) => {
          dispatch({ type: ActionTypes.MARK_CONTENT_COMPLETED, payload: contentId });
        });
      }
      if (data.practiceRecords) {
        data.practiceRecords.forEach(record => {
          dispatch({ type: ActionTypes.ADD_PRACTICE_RECORD, payload: record });
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };
  
  // 计算连续打卡天数
  const getStreak = () => {
    const dates = Object.values(state.completedContents)
      .filter(r => r.completed)
      .map(r => r.date)
      .sort()
      .reverse();
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // 检查今天或昨天是否有完成记录
    if (dates[0] !== today && dates[0] !== yesterday) return 0;
    
    let currentDate = new Date(dates[0]);
    for (const date of dates) {
      const recordDate = new Date(date);
      const diffDays = Math.round((currentDate - recordDate) / 86400000);
      if (diffDays <= 1) {
        streak++;
        currentDate = recordDate;
      } else {
        break;
      }
    }
    return streak;
  };
  
  // 获取当月完成记录
  const getMonthRecords = (year, month) => {
    const records = {};
    Object.entries(state.completedContents).forEach(([contentId, record]) => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month) {
        const day = recordDate.getDate();
        records[day] = record;
      }
    });
    return records;
  };
  
  const value = {
    state,
    dispatch,
    ActionTypes,
    exportData,
    importData,
    getStreak,
    getMonthRecords,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 自定义 Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export { ActionTypes };
