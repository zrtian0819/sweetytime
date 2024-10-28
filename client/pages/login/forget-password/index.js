import React from 'react';
import Image from 'next/image';
import ExpandButton from '@/components/button/expand-button';
import Link from 'next/link';

// import RainEffect from '@/components/dessertRain';

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
				{/* <div className={styles['WGS-dessertRain']}>
					<RainEffect />
				</div> */}
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
				{/* <div
					className={`${styles['WGS-loginPig']} ${styles['pig-show']} ${styles['pig-goodbye']}`}
				>
					<div className={styles['WGS-pigTalk']}>
						<Image
							src="/vector/duck_talk.svg"
							alt="duck_talk"
							width={230}
							height={180}
						/>
						<div className={styles['WGS-talkText']}>要多吃銀杏囉!</div>
					</div>
					<Image src="/vector/pig.svg" alt="pig" width={180} height={150} />
				</div> */}
			</div>
		</>
	);
};

export default forgetPassword;
