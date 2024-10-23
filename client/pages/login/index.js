import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/WGS-login.module.scss';

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<>
			<div className={styles['WGS-loginContainer']}>
				<div className={styles['WGS-loginBgS']}>SWEETY SWEETY SWEETY</div>
				<div className={styles['WGS-loginBgT']}>TIME TIME TIME TIME</div>
				<div className={styles['WGS-loginCard']}>
					<h1 className={styles['WGS-title']}>Sweety time</h1>
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
								type={showPassword ? 'text' : 'password'}
								placeholder="password"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className={styles['WGS-eyeIcon']}
							>
								<Image
									src={`/icon_${showPassword ? 'eye2' : 'eye'}.svg`}
									alt="toggle password visibility"
									width={20}
									height={20}
								/>
							</button>
						</div>
						<div className={styles['WGS-rememberMe']}>
							<input type="checkbox" id="remember" />
							<label htmlFor="remember">記住我</label>
						</div>
						<div>
							<div className={styles['WGS-errorMessage']}>
								帳號密碼錯誤,請再試一次
							</div>
							<button className={styles['WGS-loginBtn']} type="submit">
								登 入
							</button>
						</div>
					</form>
					<div className={styles['WGS-bottomLinks']}>
						<a href="login/register">註冊</a>
						<a href="login/forget-password">忘記密碼</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
