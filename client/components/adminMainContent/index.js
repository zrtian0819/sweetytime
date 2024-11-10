import React from 'react';
import styles from './admin-content.module.scss';
import Pagination from '../pagination';

const AdminMainContent = ({ children, currentPage, totalPages, onPageChange }) => {
	return (
		<div className={styles.content}>
			<div className={styles.pageContent}>
				{children}
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
		</div>
	);
};

export default AdminMainContent;
