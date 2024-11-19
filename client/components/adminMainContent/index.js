import React from 'react';
import styles from './admin-content.module.scss';
import Pagination from '../pagination';

const AdminMainContent = ({ children, currentPage, totalPages, onPageChange }) => {
	return (
		<div className={styles.pageContent}>
			<div className={styles.content}>{children}</div>
			<div className={styles.Pagination}>
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
						changeColor="#fe6f67"
					/>
				)}
			</div>
		</div>
	);
};

export default AdminMainContent;
