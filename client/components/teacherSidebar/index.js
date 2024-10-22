import React from 'react';
import styles from './teacher-sidebar.module.css'; // 引入模塊化樣式

const TeacherSidebar = ({ toggleSidebar }) => {
  return (
    <div className={styles.sidebar}>
      <h3>搜尋你有興趣的老師專長</h3>
      <input type="text" placeholder="關鍵字" className={styles.searchBar} />
      <div className={styles.filterOptions}>
        <label><input type="radio" name="status" value="open" /> 開課中</label>
        <label><input type="radio" name="status" value="closed" /> 課程截止</label>
        <label><input type="checkbox" name="category" value="japanese" /> 日式甜點</label>
        <label><input type="checkbox" name="category" value="french" /> 法式甜點</label>
        <label><input type="checkbox" name="category" value="bread" /> 烘焙麵包</label>
        <label><input type="checkbox" name="category" value="decoration" /> 藝術擠花裝飾</label>
      </div>
      
      {/* 收合按鈕（顯示三條白線） */}
      <div className={styles.sidebarToggle} onClick={toggleSidebar}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
};

export default TeacherSidebar;
