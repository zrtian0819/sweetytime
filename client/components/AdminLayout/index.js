// components/AdminLayout.js
import React from 'react';
import AdminNavbar from '@/components/adminNavbar';
import Sidebar from '@/components/adminSidebar';
import AdminMainContent from '@/components/adminMainContent';
import styles from '@/styles/admin.module.scss';

const AdminLayout = ({ children, currentPage, totalPages, onPageChange }) => {
	return (
		<div className={styles.adminContainer}>
			<AdminNavbar className={styles.navbar} />
			<div className={styles.mainBody}>
				<Sidebar className={styles.sidebar} />
				<AdminMainContent
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
				>
					{children}
				</AdminMainContent>
			</div>
		</div>
	);
};

export default AdminLayout;
