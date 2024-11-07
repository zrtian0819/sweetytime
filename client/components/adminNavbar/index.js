import React from 'react';
import Link from 'next/link';
import { Navbar } from 'react-bootstrap';
import { AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import styles from './admin-navbar.module.scss';

const AdminNavbar = () => {
	return (
		<Navbar expand="lg" className={`${styles.navbar} fixed-top`}>
			<div className="d-flex align-items-center">
				{/* Logo */}
				<img 
					src="../photos/sweet_time_logo1.png" 
					alt="Logo" 
					className={styles.logo}
					style={{ height: '40px', width: 'auto' }} 
				/>
			</div>

			<div className="d-flex align-items-center ml-auto">
				<div className={styles.Badge}>Hello 帥哥!火腿蛋餅要飲料嗎？</div>

				{/* Icon Group */}
				<div className={`${styles.iconGroup} ml-3`}>
					<AiOutlineBell 
						className={styles.icon} 
						style={{ fontSize: '24px', cursor: 'pointer', margin: '0 15px' }} 
					/>
					<AiOutlineUser 
						className={styles.icon} 
						style={{ fontSize: '24px', cursor: 'pointer' }} 
					/>
					
					{/* Log Out Button */}
					<div 
						className={`${styles.icon} ${styles.logout}`} 
						onClick={() => alert('登出功能待鈞盛實現')}
						style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					>
						<span style={{ marginLeft: '10px' }}>Log Out</span>
						<FiLogOut style={{ fontSize: '24px', marginLeft: '5px' }} />
					</div>
				</div>
			</div>
		</Navbar>
	);
};

export default AdminNavbar;
