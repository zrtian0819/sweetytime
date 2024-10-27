import React from 'react';
import styles from './pagination.module.scss';
import { SlControlPlay } from 'react-icons/sl';

const Pagination = ({ currentPage, totalPages, onPageChange, changeColor = 'white' }) => {
	return (
		<>
			<div className={styles.paginationContainer}>
				<button
					className={`${styles.paginationButton} color`}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<SlControlPlay
						style={{ transform: 'rotate(180deg)' }}
						size={16}
						color={changeColor}
					/>
				</button>
				<div className={`${styles.pageNumber} color border-color`}>
					<span className="color">{currentPage}</span>
				</div>
				<button
					className={`${styles.paginationButton} color`}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<SlControlPlay size={16} color={changeColor} />
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
