import { useState, useEffect } from 'react';
import ExpandButton from '@/components/button/expand-button';
import Link from 'next/link';
import useInterval from '@/hooks/use-interval';
import toast, { Toaster } from 'react-hot-toast';

import styles from '../../../styles/WGS-login.module.scss';

const forgetPassword = () => {
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
	const [password, setPassword] = useState('');
	const [disableBtn, setDisableBtn] = useState(false);

	// 倒數計時 countdown use
	const [count, setCount] = useState(60); // 60s
	const [delay, setDelay] = useState(null); // delay=null可以停止, delay是數字時會開始倒數

	// 倒數計時 countdown use
	useInterval(() => {
		setCount(count - 1);
	}, delay);
	// 倒數計時 countdown use
	useEffect(() => {
		if (count <= 0) {
			setDelay(null);
			setDisableBtn(false);
		}
	}, [count]);

	// 處理要求一次性驗証碼用
	const handleRequestOtpToken = async () => {
		if (delay !== null) {
			toast.error('錯誤 - 60s內無法重新獲得驗証碼');
			return;
		}

		const res = await requestOtpToken(email);

		// 除錯用
		console.log(res.data);

		if (res.data.status === 'success') {
			toast.success('資訊 - 驗証碼已寄送到電子郵件中');
			setCount(60); // 倒數 60秒
			setDelay(1000); // 每 1000ms = 1s 減1
			setDisableBtn(true);
		} else {
			toast.error(`錯誤 - ${res.data.message}`);
		}
	};

	// 處理重設密碼用
	const handleResetPassword = async () => {
		const res = await resetPassword(email, password, token);
		// 除錯用
		console.log(res.data);

		if (res.data.status === 'success') {
			toast.success('資訊 - 密碼已成功修改');
		} else {
			toast.error(`錯誤 - ${res.data.message}`);
		}
	};
	return (
		<>
			<div className={styles['WGS-loginContainer']}>
				{/* 返回首頁鍵 */}
				<div className={styles['WGS-back']}>
					<Link href="/login">
						<ExpandButton value="返回登入" />
					</Link>
				</div>
				<div className={styles['WGS-loginCardPW']}>
					<h1 className={styles['WGS-title']}>Sweety time</h1>
					<h3 className={styles['WGS-title2']}>忘記密碼</h3>
					<form className={styles['WGS-loginForm']}>
						<input
							className={styles['WGS-loginInput']}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="輸入您的email"
						/>
						<div>
							<div className={styles['WGS-otpGroup']}>
								<input
									type="text"
									value={token}
									onChange={(e) => setToken(e.target.value)}
									placeholder="輸入驗證碼"
								/>
								<button
									type="button"
									onClick={handleRequestOtpToken}
									disabled={disableBtn}
								>
									{delay ? `${count}秒後重試` : '取得驗證碼'}
								</button>
							</div>
							<br />
							<div className={styles['WGS-inputGroup']}>
								<label>
									一次性驗証碼:
									<input
										type="text"
										value={token}
										onChange={(e) => setToken(e.target.value)}
									/>
								</label>
							</div>

							<div className={styles['WGS-inputGroup']}>
								<label>
									新密碼:
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</label>
							</div>
							<br />
							<button
								className={styles['WGS-loginBtn']}
								onClick={handleResetPassword}
							>
								重設密碼
							</button>
							{/* 土司訊息視窗用 */}
							<Toaster />
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default forgetPassword;
