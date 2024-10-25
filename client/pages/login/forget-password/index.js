import React from 'react';
import Image from 'next/image';

import RainEffect from '@/components/dessertRain';

import styles from '../../../styles/WGS-login.module.scss';

const forgetPassword = () => {
	return (
		<>
			<div className={styles['WGS-loginContainer']}>
				<div className={styles['WGS-dessertRain']}>
					<RainEffect />
				</div>
				<div className={styles['WGS-loginCard']}>
					<h1 className={styles['WGS-title']}>Sweety time</h1>
					<h2 className={styles['WGS-title']}>忘記密碼</h2>
					<form className={styles['WGS-loginForm']}>
						<input
							className={styles['WGS-loginInput']}
							type="text"
							placeholder="user name"
							required
						/>
						<div className={styles['WGS-passwordContainer']}>
							<input
								className={styles['WGS-loginInput']}
								type="password"
								placeholder="password"
								required
							/>
						</div>
						<div>
							<div className={styles['WGS-errorMessage']}>
								兩次密碼不同,請再試一次
							</div>
							<button className={styles['WGS-loginBtn']} type="submit">
								登 入
							</button>
						</div>
					</form>
				</div>
				<div
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
				</div>
			</div>
		</>
	);
};

export default forgetPassword;
