import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import Styles from '@/styles/user.module.scss';
import Button from '@mui/material/Button';
import { useUser } from '@/context/userContext';
import { withAuth } from '@/components/auth/withAuth';

// 表單初始值
const initialFormState = {
	name: '',
	email: '',
	phone: '',
	birthday: '',
	portrait_path: '',
};

function Profile() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { user, setUser, updateUser } = useUser();
	const [errorMessage, setErrorMessage] = useState('');
	const [formData, setFormData] = useState(initialFormState);
	const [isDirty, setIsDirty] = useState(false); // 追踪表單是否被修改

	// 使用 useCallback 優化效能
	const initializeFormData = useCallback(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				phone: user.phone || '',
				birthday: user.birthday || '',
				portrait_path: user.portrait_path || '',
			});
		}
	}, [user]);
	// 初始化表單數據
	useEffect(() => {
		initializeFormData();
	}, [initializeFormData]);

	// 處理表單離開前的提醒
	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = ''; // Chrome requires returnValue to be set
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

		// 表單驗證
		const errors = validateForm();
		if (errors.length > 0) {
			setErrorMessage(errors.join('\n'));
			return;
		}

		setIsLoading(true);
		setErrorMessage('');

		try {
			await updateUser(formData); // 使用 context 提供的方法
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

	// 重置表單
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
						</form>
					</div>
				</div>
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}
export default withAuth(Profile);
