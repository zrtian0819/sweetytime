import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import Button from '@mui/material/Button';
import { useUser } from '@/context/userContext';
import { withAuth } from '@/components/auth/withAuth';
import PasswordValidation from '@/components/PasswordValidation';
import toast, { Toaster } from 'react-hot-toast';

import Styles from '@/styles/user.module.scss';

// 簡化後的密碼重設API
const resetPassword = async (email, newPassword) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/reset-password-profile`,
			{
				email,
				newPassword,
			}
		);
		return response;
	} catch (error) {
		return {
			data: {
				status: 'error',
				message: error.response?.data?.message || '重設密碼失敗',
			},
		};
	}
};

// 表單初始值
const initialFormState = {
	name: '',
	email: '',
	phone: '',
	password: '',
	birthday: '',
	portrait_path: '',
};

function Profile() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { user, setUser, updateUser } = useUser();
	const [errorMessage, setErrorMessage] = useState('');
	const [formData, setFormData] = useState(initialFormState);
	const [isDirty, setIsDirty] = useState(false);

	const [password, setPassword] = useState('');
	const [isPasswordValid, setIsPasswordValid] = useState(false);

	// 使用 useCallback 優化效能
	const initializeFormData = useCallback(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				phone: user.phone || '',
				password: user.password || '',
				birthday: user.birthday || '',
				portrait_path: user.portrait_path || '',
			});
		}
	}, [user]);

	useEffect(() => {
		initializeFormData();
	}, [initializeFormData]);

	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [isDirty]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setIsDirty(true);
		setErrorMessage('');
	};

	const handlePasswordReset = async (e) => {
		e.preventDefault();

		if (!password) {
			toast.error('請輸入新密碼');
			return;
		}

		if (!isPasswordValid) {
			toast.error('請確認密碼符合所有要求');
			return;
		}

		const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
		if (!passwordRegex.test(password)) {
			toast.error('密碼需要包含至少一個字母（大小寫皆可）、一個數字');
			return;
		}

		setIsLoading(true);
		try {
			const res = await resetPassword(formData.email, password);
			if (res.data.status === 'success') {
				toast.success('密碼已成功修改');
				setPassword('');
			} else {
				toast.error(`錯誤 - ${res.data.message}`);
			}
		} catch (error) {
			toast.error('密碼更新失敗，請稍後再試');
		} finally {
			setIsLoading(false);
		}
	};

	// 表單驗證
	const validateForm = () => {
		const errors = [];

		if (!formData.name.trim()) {
			errors.push('姓名為必填欄位');
		}

		if (!formData.email.trim()) {
			errors.push('Email為必填欄位');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.push('請輸入有效的Email格式');
		}

		if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
			errors.push('請輸入有效的電話號碼格式（10位數字）');
		}

		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const errors = validateForm();
		if (errors.length > 0) {
			setErrorMessage(errors.join('\n'));
			return;
		}

		setIsLoading(true);
		setErrorMessage('');

		try {
			await updateUser(formData);
			setIsDirty(false);
			alert('個人資料更新成功！');
		} catch (error) {
			console.error('Update error:', error);
			if (error.code === 'ECONNABORTED') {
				setErrorMessage('請求超時，請稍後再試');
			} else if (error.response?.status === 401) {
				setErrorMessage('登入已過期，請重新登入');
				router.push('/login');
			} else {
				setErrorMessage(error.response?.data?.message || '更新失敗，請稍後再試');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		if (window.confirm('確定要重置所有更改嗎？')) {
			initializeFormData();
			setIsDirty(false);
			setErrorMessage('');
		}
	};

	return (
		<>
			<Header />
			<UserBox>
				<h2 className={`${Styles['WGS-pColor']}`}>使用者資料</h2>
				<div className={`${Styles['TIL-userbody']} d-flex flex-column flex-md-row`}>
					<div className={`${Styles['TIL-user-right']}`}>
						{errorMessage && (
							<div className="alert alert-danger mx-5 mt-3">
								{errorMessage.split('\n').map((error, index) => (
									<div key={index}>{error}</div>
								))}
							</div>
						)}
						<form onSubmit={handleSubmit}>
							<div className="container-fluid">
								{/* 帳號（唯讀） */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">使用者帳號</div>
									<div className="col-auto">{user.account}</div>
								</div>

								<hr />

								{/* 姓名 */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">
										姓名 <span className="text-danger">*</span>
									</div>
									<div className="col-auto">
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											className="form-control"
											required
											maxLength={50}
										/>
									</div>
								</div>

								<hr />

								{/* Email */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">
										Email <span className="text-danger">*</span>
									</div>
									<div className="col-auto">
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="form-control"
											required
											pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
										/>
									</div>
								</div>

								<hr />

								{/* 電話 */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">電話號碼</div>
									<div className="col-auto">
										<input
											type="tel"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											className="form-control"
											pattern="[0-9]{10}"
											title="請輸入10位數字的電話號碼"
										/>
									</div>
								</div>

								<hr />

								{/* 生日 */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">生日</div>
									<div className="col-auto">
										<input
											type="date"
											name="birthday"
											value={formData.birthday}
											onChange={handleInputChange}
											className="form-control"
											max={new Date().toISOString().split('T')[0]}
										/>
									</div>
								</div>

								<hr />

								{/* 提交按鈕 */}
								<div className="row justify-content-end me-5 mt-4">
									<div className="col-auto">
										<Button
											type="button"
											variant="outlined"
											onClick={handleReset}
											disabled={isLoading || !isDirty}
										>
											重置
										</Button>
									</div>
									<div className="col-auto">
										<Button
											type="submit"
											variant="contained"
											disabled={isLoading || !isDirty}
											sx={{
												color: '#FFF',
												background: '#fe6f67',
												'&:hover': {
													background: '#fe6f67',
												},
											}}
										>
											{isLoading ? '更新中...' : '儲存變更'}
										</Button>
									</div>
								</div>
							</div>
							<hr />

							{/* 密碼重設 */}
							<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
								<div className="col-4">修改密碼</div>
								<div className="col-auto">
									<div className="password-reset-section">
										{/* 可選: 增加輸入當前密碼的欄位來驗證 */}
										<input
											type="password"
											className="form-control mb-2 w-100"
											placeholder="輸入當前密碼"
										/>

										{/* 新密碼欄位 */}
										<input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="form-control mb-2 w-100"
											placeholder="輸入新密碼 (至少5位，含英文和數字)"
										/>

										{/* 確認新密碼欄位 */}
										<input
											type="password"
											className="form-control mb-2 w-100"
											placeholder="確認新密碼"
										/>

										<PasswordValidation
											password={password}
											onValidationChange={setIsPasswordValid}
										/>
									</div>
								</div>
								<div className='d-flex justify-content-end mb-3'>
									<Button
										type="button"
										variant="contained"
										onClick={handlePasswordReset}
										disabled={!isPasswordValid || isLoading}
										className="mt-3 w-10"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
											'&:hover': {
												background: '#fe6f67',
											},
										}}
									>
										{isLoading ? '更新密碼中...' : '更新密碼'}
									</Button>
								</div>
								<hr />
							</div>
						</form>
					</div>
				</div>
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}

export default withAuth(Profile);
