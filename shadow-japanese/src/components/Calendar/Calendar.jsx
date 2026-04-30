import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Calendar.module.css';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function Calendar() {
  const { getMonthRecords, getStreak } = useApp();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  
  const records = getMonthRecords(currentYear, currentMonth);
  const streak = getStreak();
  
  // 计算当月天数
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  
  // 获取当月第一天是星期几
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };
  
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  // 渲染日历格子
  const renderDays = () => {
    const days = [];
    
    // 填充空白格子
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`} />);
    }
    
    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        today.getFullYear() === currentYear && 
        today.getMonth() + 1 === currentMonth && 
        today.getDate() === day;
      
      const hasRecords = records[day]?.completed;
      
      days.push(
        <div 
          key={day} 
          className={`${styles.day} ${isToday ? styles.today : ''} ${hasRecords ? styles.completed : ''}`}
        >
          <span className={styles.dayNumber}>{day}</span>
        </div>
      );
    }
    
    return days;
  };
  
  // 统计当月完成天数
  const completedDays = Object.keys(records).filter(day => records[day]?.completed).length;
  
  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h3 className={styles.monthTitle}>
          {currentYear}年 {currentMonth}月
        </h3>
        <div className={styles.navButtons}>
          <button className={styles.navButton} onClick={handlePrevMonth}>‹</button>
          <button className={styles.navButton} onClick={handleNextMonth}>›</button>
        </div>
      </div>
      
      <div className={styles.weekdays}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      
      <div className={styles.days}>
        {renderDays()}
      </div>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>连续打卡</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{completedDays}</span>
          <span className={styles.statLabel}>本月完成</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{daysInMonth}</span>
          <span className={styles.statLabel}>本月天数</span>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
