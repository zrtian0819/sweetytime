import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import Styles from '@/styles/user.module.scss';
import Button from '@mui/material/Button';

export default function Lesson() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState(null);
	// 修改表單數據的 state
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		birthday: '',
		address: '',
	});

	// 檢查用戶是否登入
	useEffect(() => {
		// 從 localStorage 獲取用戶資訊
		const userStr = localStorage.getItem('user');
		if (!userStr) {
			// 如果沒有用戶資訊，重定向到登入頁面
			router.push('/login');
			return;
		}

		const user = JSON.parse(userStr);
		setUserData(user);

		// 填充表單資料
		setFormData({
			name: user.name || '',
			email: user.email || '',
			phone: user.phone || '',
			birthday: user.birthday || '',
			address: user.address || '',
		});
	}, []);
	// 處理輸入變更
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// 處理表單提交
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${userData.token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.data.success) {
				// 更新 localStorage 中的用戶資料
				const updatedUser = { ...userData, ...formData };
				localStorage.setItem('user', JSON.stringify(updatedUser));
				setUserData(updatedUser);

				alert('個人資料更新成功！');
			}
		} catch (error) {
			console.error('Update error:', error);
			alert(error.response?.data?.message || '更新失敗，請稍後再試');
		} finally {
			setIsLoading(false);
		}
	};

	if (!userData) {
		return <div>Loading...</div>;
	}
	return (
		<>
			<Header />
			<UserBox>
				<div className={`${Styles['TIL-userbody']} d-flex flex-column flex-md-row`}>
					<div className={`${Styles['TIL-user-right']}`}>
						<form onSubmit={handleSubmit}>
							<div className="container-fluid">
								{/* 帳號（唯讀） */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">使用者帳號</div>
									<div className="col-auto">{userData.account}</div>
								</div>

								<hr />

								{/* 姓名 */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">姓名</div>
									<div className="col-auto">
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											className="form-control"
										/>
									</div>
								</div>

								<hr />

								{/* Email */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">Email</div>
									<div className="col-auto">
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="form-control"
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
										/>
									</div>
								</div>

								<hr />

								{/* 地址 */}
								<div className="row d-flex justify-content-start ms-5 align-items-center mb-3">
									<div className="col-4">地址</div>
									<div className="col-auto">
										<input
											type="text"
											name="address"
											value={formData.address}
											onChange={handleInputChange}
											className="form-control"
										/>
									</div>
								</div>

								<hr />

								{/* 提交按鈕 */}
								<div className="row justify-content-end me-5 mt-4">
									<div className="col-auto">
										<Button
											type="submit"
											variant="contained"
											disabled={isLoading}
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
