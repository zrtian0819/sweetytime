import React from 'react';
import styles from './pagination.module.css'; // 導入 CSS 模塊

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀
      </button>
      <div className={styles.pageNumber}>
        <span>{currentPage}</span>
      </div>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;
