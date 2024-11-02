import React from 'react';
import styles from './admin-content.module.scss';

const AdminMainContent = ({ children }) => {
  return (
    <div className={styles.content}>
      <div className={styles.pageContent}>
        {children}
      </div>
    </div>
  );
};

export default AdminMainContent;
