import React from 'react';
import styles from './pagination.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Pagination = ({ currentPage, totalPages, onPageChange, changeColor = 'white' }) => {
	return (
		<>
			<div className={styles.paginationContainer}>
				<button
					className={`${styles.paginationButton} color`}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<i className="fa-solid fa-play" style={{ transform: 'rotate(180deg)' }}></i>
				</button>
				<div className={`${styles.pageNumber} color border-color`}>
					<span className="color">{currentPage}</span>
				</div>
				<button
					className={`${styles.paginationButton} color`}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<i className="fa-solid fa-play"></i>
				</button>
			</div>
			<style jsx>
				{`
					.color {
						color: ${changeColor};
					}
					.border-color {
						color: ${changeColor};
					}
				`}
			</style>
		</>
	);
};

export default Pagination;
