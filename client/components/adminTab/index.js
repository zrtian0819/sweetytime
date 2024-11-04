import React from 'react';
import styles from './tab.module.scss';

const adminTab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div>
      {/* 標籤頁 */}
      <div className={styles.navTabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabButton} ${activeTab === tab.key ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tabs.map((tab) => (
          activeTab === tab.key && (
            <div key={tab.key} className={styles.tabPane}>
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default adminTab;
