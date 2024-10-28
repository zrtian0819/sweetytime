import React, { useState, useEffect } from 'react';
import styles from './pagination.module.scss';
import { SlControlPlay } from 'react-icons/sl';

const Pagination = ({ items, itemsPerPage = 10, onItemsChange, changeColor = 'white' }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(items.length / itemsPerPage);

	// 計算當前頁顯示的項目範圍
	useEffect(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		onItemsChange(items.slice(startIndex, endIndex));
	}, [currentPage, items, itemsPerPage, onItemsChange]);

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<>
			<div className={styles.paginationContainer}>
				<button
					className={`${styles.paginationButton} color`}
					onClick={() => handlePageChange(currentPage - 1)}
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
					onClick={() => handlePageChange(currentPage + 1)}
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
