import React from 'react';
import ExpandButton from '@/components/button/expand-button';
import Link from 'next/link';

import styles from '../../../styles/WGS-login.module.scss';

const forgetPassword = () => {
	return (
		<>
			<div className={styles['WGS-loginContainer']}>
				{/* 返回首頁鍵 */}
				<div className={styles['WGS-back']}>
					<Link href="/login">
						<ExpandButton value="返回登入" />
					</Link>
				</div>
				<div className={styles['WGS-loginCard']}>
					<h1 className={styles['WGS-title']}>Sweety time</h1>
					<h3 className={styles['WGS-title2']}>忘記密碼</h3>
					<form className={styles['WGS-loginForm']}>
						<input
							className={styles['WGS-loginInput']}
							type="email"
							placeholder="輸入您的email"
							required
						/>
						<div>
							<button className={styles['WGS-forgetBtn']} type="submit">
								寄送Mail
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default forgetPassword;
