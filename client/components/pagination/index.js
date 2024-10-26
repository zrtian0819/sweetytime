import React from 'react';
import styles from './pagination.module.scss'; 
import '@fortawesome/fontawesome-free/css/all.min.css';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fa-solid fa-play" style={{ transform: 'rotate(180deg)', color:`#000` }}></i>
      </button>
      <div className={styles.pageNumber}>
        <span>{currentPage}</span>
      </div>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fa-solid fa-play"></i>
      </button>
    </div>
  );
};

export default Pagination;
