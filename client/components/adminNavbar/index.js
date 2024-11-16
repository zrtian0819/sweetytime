import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from 'react-bootstrap';
import { IoMdHome } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import styles from './admin-navbar.module.scss';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';

const AdminNavbar = () => {
	const { user, logout } = useUser();
	const router = useRouter();

	const handldHome = () => {
		router.push('/admin');
	};

	// 處理登出
	const handleLogout = async () => {
		await logout(); // 使用 context 中的 logout 函數
		router.push('/');
	};
	return (
		<Navbar expand="lg" className={`${styles.navbar} fixed-top`}>
			<div className="d-flex align-items-center">
				{/* Logo */}
				<Link href="/" passHref>
					<img
						src="/photos/sweet_time_logo1.png"
						alt="Logo"
						className={styles.logo}
						style={{ height: '60px', width: 'auto' }}
					/>
				</Link>
			</div>
			<div className="d-flex align-items-center ml-auto gap-2">
				<div className={styles.Badge}>Hello, {user?.name || ''}</div>
				<div className={styles.role}>{user?.role || ''}</div>

				{/* Icon Group */}
				<div className={`${styles.iconGroup}`}>
					<IoMdHome
						className={styles.icon}
						style={{ fontSize: '24px' }}
						onClick={handldHome}
					/>
					{/* Log Out Button */}
					<div className={`${styles.icon} ${styles.logout}`} onClick={handleLogout}>
						<span style={{ marginLeft: '5px' }}>Log Out</span>
						<FiLogOut style={{ fontSize: '24px', marginLeft: '5px' }} />
					</div>
				</div>
			</div>
		</Navbar>
	);
};

export default AdminNavbar;
