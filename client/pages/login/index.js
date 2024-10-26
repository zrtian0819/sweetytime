import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/WGS-login.module.scss';

const Login = () => {
	const [showRegister, setShowRegister] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showDucktalk, setShowDucktalk] = useState(false);

	const handleBack = () => {
		setShowDucktalk(true); // 先顯示掰掰
		setTimeout(() => {
			setShowRegister(false);
			setShowDucktalk(false); // 重置掰掰狀態
		}, 1500);
	};

	return (
		<>
			<div className={styles['WGS-loginContainer']}>
				<div className={styles['WGS-loginBgS']}>SWEETY SWEETY SWEETY</div>
				<div className={styles['WGS-loginBgT']}>TIME TIME TIME TIME</div>

				<div className={styles['WGS-cards-container']}>
					<div
						className={`${styles['WGS-loginCard']} ${
							showRegister ? styles['slide-left'] : ''
						}`}
					>
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
										src={`vector/icon_${showPassword ? 'eye2' : 'eye'}.svg`}
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
							<button
								onClick={() => setShowRegister(true)}
								className={styles['WGS-linkBtn']}
							>
								註冊
							</button>
							<a href="login/forget-password">忘記密碼</a>
						</div>
					</div>
					{/* 註冊頁面 */}
					<div
						className={`${styles['WGS-registerinCard']} ${
							showRegister ? styles['slide-in'] : ''
						}`}
					>
						<button className={styles['WGS-backBtn']} onClick={handleBack}>
							返回登入
						</button>
						<h1 className={styles['WGS-title']}>會員註冊</h1>
						<input
							className={styles['WGS-register-input']}
							placeholder="first name | 姓氏"
						/>
						<input
							className={styles['WGS-register-input']}
							placeholder="last name | 姓名"
						/>
						<select className={styles['WGS-register-select']}>
							<option value="" disabled selected>
								gender | 性別
							</option>
							<option value="male">男</option>
							<option value="female">女</option>
							<option value="other">其他</option>
						</select>
						<input
							className={styles['WGS-register-input']}
							placeholder="phone | 電話"
						/>
						<input
							className={styles['WGS-register-input']}
							placeholder="e-mail | 電子信箱"
							type="email"
						/>
						<input
							className={styles['WGS-register-date']}
							type="date"
							placeholder="birthday | 生日"
							required
						/>
						<input
							className={styles['WGS-register-input']}
							placeholder="account | 帳號"
						/>
						<input
							className={styles['WGS-register-input']}
							placeholder="password | 密碼"
							type="password"
						/>
						<input
							className={styles['WGS-register-input']}
							placeholder="retype password | 重新輸入密碼"
							type="password"
						/>
						<div className={styles['WGS-checkbox-container']}>
							<input type="checkbox" id="terms" className={styles['WGS-checkbox']} />
							<label htmlFor="terms">
								請查看<span className={styles['WGS-terms']}>使用條款</span>
								以保障個人權益
							</label>
						</div>
						<button className={styles['WGS-submit-button']}>我要申請成為會員</button>
					</div>
				</div>
				<div
					className={`${styles['WGS-loginDuck']} ${
						showRegister ? styles['duck-show'] : ''
					} ${showDucktalk ? styles['duck-goodbye'] : ''}`}
				>
					<div className={styles['WGS-duckTalk']}>
						<Image
							src={`vector/duck_talk.svg`}
							alt="duck_talk"
							width={230}
							height={180}
						/>
						<div className={styles['WGS-talkText']}>
							{showDucktalk ? (
								'掰掰～'
							) : (
								<span className={styles['WGS-duck-hello']}>歡迎加入會員呱</span>
							)}
						</div>
					</div>
					<Image src={`vector/duck.svg`} alt="duck" width={230} height={180} />
				</div>
			</div>
		</>
	);
};

export default Login;
