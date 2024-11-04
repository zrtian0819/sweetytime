import React from 'react';
import styles from './pagination.module.scss';
import { SlControlPlay } from 'react-icons/sl';

const Pagination = ({ currentPage, totalPages, onPageChange, changeColor = 'white' }) => {
	const maxPagesToShow = 4;

	// 渲染頁碼按鈕
	const renderPageNumbers = () => {
		const pageNumbers = [];

		// 如果總頁數小於等於最大顯示頁碼數，直接顯示所有頁碼
		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(renderPageNumberButton(i));
			}
		} else {
			let startPage = Math.max(1, currentPage - 2);
			let endPage = Math.min(totalPages, currentPage + 2);

			// 如果當前頁碼接近開頭，顯示前 4 個頁碼
			if (currentPage <= 3) {
				startPage = 1;
				endPage = maxPagesToShow;
			}
			// 如果當前頁碼接近結尾，顯示最後 4 個頁碼
			else if (currentPage >= totalPages - 2) {
				startPage = totalPages - maxPagesToShow + 1;
				endPage = totalPages;
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(renderPageNumberButton(i));
			}

			// 顯示前省略號 ．．．
			if (startPage > 1) {
				pageNumbers.unshift(
					<button
						key="start-ellipsis"
						className={`${styles.pageNumber} ${styles.ellipsis}`}
						onClick={() => onPageChange(startPage - 1)}
					>
						...
					</button>
				);
			}

			// 顯示後省略號 ．．．
			if (endPage < totalPages) {
				pageNumbers.push(
					<button
						key="end-ellipsis"
						className={`${styles.pageNumber} ${styles.ellipsis}`}
						onClick={() => onPageChange(endPage + 1)}
					>
						...
					</button>
				);
			}
		}

		return pageNumbers;
	};

	// 渲染單個頁碼按鈕
	const renderPageNumberButton = (page) => (
		<button
			key={page}
			className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
			onClick={() => onPageChange(page)}
		>
			{page}
		</button>
	);

	return (
		<div className={styles.paginationContainer}>
			<button
				className={styles.paginationButton}
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<SlControlPlay
					style={{ transform: 'rotate(180deg)' }}
					size={16}
					color={changeColor}
				/>
			</button>
			<div className={styles.pageNumbersContainer}>{renderPageNumbers()}</div>
			<button
				className={styles.paginationButton}
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<SlControlPlay size={16} color={changeColor} />
			</button>
		</div>
	);
};

export default Pagination;
