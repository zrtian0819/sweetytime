import React from 'react';
import styles from './admin-content.module.scss';

const AdminContent = () => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2>Hi, User</h2>
        <p>Welcome back to your dashboard</p>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <img src="/images/book1.jpg" alt="Book" />
          <h3>Popular</h3>
          <p>Description of popular item.</p>
        </div>
        {/* 其他卡片 */}
      </div>
    </div>
  );
};

export default AdminContent;
