import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from 'react-bootstrap';
import { AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import styles from './admin-navbar.module.scss';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';

const AdminNavbar = () => {
	const { user, logout } = useUser();
	const router = useRouter();

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
			<div className="d-flex align-items-center ml-auto">
				<div className={styles.Badge}>Hello, {user?.name || ''}</div>

				{/* Icon Group */}
				<div className={`${styles.iconGroup}`}>
					<AiOutlineBell
						className={styles.icon}
						style={{ fontSize: '24px', cursor: 'pointer' }}
					/>
					<AiOutlineUser
						className={styles.icon}
						style={{ fontSize: '24px', cursor: 'pointer' }}
					/>

					{/* Log Out Button */}
					<div
						className={`${styles.icon} ${styles.logout}`}
						onClick={handleLogout}
						style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					>
						<span style={{ marginLeft: '5px' }}>Log Out</span>
						<FiLogOut style={{ fontSize: '24px', marginLeft: '5px' }} />
					</div>
				</div>
			</div>
		</Navbar>
	);
};

export default AdminNavbar;
