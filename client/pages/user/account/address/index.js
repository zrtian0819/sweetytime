import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Img from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import Styles from '@/styles/user.module.scss';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';
import { withAuth } from '@/components/auth/withAuth';
import { useUser } from '@/context/userContext';

function Address() {
	const router = useRouter();
	const { user } = useUser();
	const [addresses, setAddresses] = useState([]);
	const [edit, setEdit] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// 獲取地址列表
	const fetchAddresses = async () => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			console.log('Access token:', accessToken);

			if (!accessToken) {
				console.log('No token available'); // 除錯訊息
				setError('No token available');
				setIsLoading(false);
				return;
			}

			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/address`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			console.log('API Response:', response.data); // 檢查 API 回應

			if (response.data.success) {
				setAddresses(response.data.data);
				setEdit(new Array(response.data.data.length).fill(false));
			}
		} catch (error) {
			console.error('Fetch addresses error:', error);
			console.error('Error response:', error.response); // 檢查錯誤回應
			setError(error.response?.data?.message || '獲取地址資料失敗');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		console.log('User state changed:', user);
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
		  fetchAddresses();
		}
	  }, [user]);

	// 如果正在載入，則顯示載入中的訊息s
	if (isLoading) {
		return (
			<>
				<Header />
				<UserBox>
					<div className={`${Styles['TIL-user-right']}`}>
						<div>Loading...</div>
						<div>請稍候...</div>
					</div>
				</UserBox>
				<Footer bgColor="#fcf3ea" />
			</>
		);
	}

	// 如果有錯誤，則顯示錯誤訊息和重試按鈕
	if (error) {
		return (
			<>
				<Header />
				<UserBox>
					<div className={`${Styles['TIL-user-right']}`}>
						<div>Error: {error}</div>
						<Button
							variant="contained"
							onClick={fetchAddresses}
							sx={{
								color: '#FFF',
								background: '#fe6f67',
								'&:hover': {
									background: '#fe6f67',
								},
							}}
						>
							重試
						</Button>
					</div>
				</UserBox>
				<Footer bgColor="#fcf3ea" />
			</>
		);
	}

	// 處理編輯狀態
	const handleEdit = (index) => {
		const newEdit = edit.map((isEdit, i) => (i === index ? !isEdit : isEdit));
		setEdit(newEdit);
	};

	// 處理更新地址
	const handleUpdate = async (id, index, formData) => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			const response = await axios.put(
			  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/address/${id}`,
			  formData,
			  {
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				  'Content-Type': 'application/json',
				},
			  }
			);

			if (response.data.success) {
				handleEdit(index);
				fetchAddresses();
				alert('地址更新成功');
			}
		} catch (error) {
			console.error('Update address error:', error);
			alert(error.response?.data?.message || '更新地址失敗');
		}
	};

	// 設置預設地址
	const handleSetDefault = async (id) => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			const response = await axios.put(
			  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/address/${id}/default`,
			  {},
			  {
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				},
			  }
			);

			if (response.data.success) {
				fetchAddresses();
				alert('已設為預設地址');
			}
		} catch (error) {
			console.error('Set default address error:', error);
			alert(error.response?.data?.message || '設置預設地址失敗');
		}
	};

	// 刪除地址
	const handleDelete = async (id) => {
		if (!confirm('確定要刪除這個地址嗎？')) {
			return;
		}

		try {
			const accessToken = localStorage.getItem('accessToken');
			const response = await axios.delete(
			  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/address/${id}`,
			  {
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				},
			  }
			);

			if (response.data.success) {
				fetchAddresses();
				alert('地址已刪除');
			}
		} catch (error) {
			console.error('Delete address error:', error);
			alert(error.response?.data?.message || '刪除地址失敗');
		}
	};

	// 新增地址
	const handleAdd = async () => {
		const name = prompt('請輸入收件人姓名：');
		if (!name) return;

		const phone = prompt('請輸入聯絡電話：');
		if (!phone) return;

		const address = prompt('請輸入地址：');
		if (!address) return;

		try {
			const accessToken = localStorage.getItem('accessToken');
			const response = await axios.post(
			  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/address`,
			  { name, phone, address },
			  {
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				  'Content-Type': 'application/json',
				},
			  }
			);

			if (response.data.success) {
				fetchAddresses();
				alert('地址新增成功');
			}
		} catch (error) {
			console.error('Add address error:', error);
			alert(error.response?.data?.message || '新增地址失敗');
		}
	};

	return (
		<>
			<Header />
			<UserBox>
				<div className={`${Styles['TIL-user-right']}`}>
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h2>我的地址</h2>
						<Button
							variant="contained"
							sx={{
								color: '#FFF',
								background: '#fe6f67',
								'&:hover': {
									background: '#fe6f67',
								},
							}}
							onClick={handleAdd}
						>
							新增地址
						</Button>
					</div>
					<ul>
						{addresses.map((address, index) => (
							<React.Fragment key={address.id}>
								<li>
									<div className="d-flex align-items-start gap-3">
										<Img
											src={'/icon/address.svg'}
											width={30}
											height={50}
											className="align-self-center"
											alt="地址圖標"
										/>
										<div className="flex-grow-1">
											<h3>收件人資料</h3>
											{edit[index] ? (
												<div className="mb-3">
													<input
														type="text"
														className="form-control mb-2"
														placeholder="收件人姓名"
														defaultValue={address.name}
														ref={(input) =>
															input && (input.dataset.field = 'name')
														}
													/>
													<input
														type="text"
														className="form-control mb-2"
														placeholder="聯絡電話"
														defaultValue={address.phone}
														ref={(input) =>
															input && (input.dataset.field = 'phone')
														}
													/>
													<input
														type="text"
														className="form-control"
														placeholder="地址"
														defaultValue={address.address}
														ref={(input) =>
															input &&
															(input.dataset.field = 'address')
														}
													/>
												</div>
											) : (
												<>
													<div>{address.name}</div>
													<div>{address.phone}</div>
													<div>{address.address}</div>
												</>
											)}
										</div>
									</div>
									<div className="d-flex justify-content-between align-items-center mt-3">
										<FormControlLabel
											control={
												<Checkbox
													checked={address.defaultAdd === 1}
													onChange={() => handleSetDefault(address.id)}
													sx={{
														color: '#fe6f67',
														'&.Mui-checked': {
															color: '#fe6f67',
														},
													}}
												/>
											}
											label={
												address.defaultAdd === 1
													? '預設地址'
													: '設為預設地址'
											}
										/>
										<div className="d-flex gap-2">
											<Button
												variant="contained"
												sx={{
													color: '#FFF',
													background: '#747474',
													'&:hover': {
														background: '#747474',
													},
												}}
												onClick={() => {
													if (edit[index]) {
														const formData = {
															name: document.querySelector(
																'input[data-field="name"]'
															).value,
															phone: document.querySelector(
																'input[data-field="phone"]'
															).value,
															address: document.querySelector(
																'input[data-field="address"]'
															).value,
														};
														handleUpdate(address.id, index, formData);
													} else {
														handleEdit(index);
													}
												}}
											>
												{edit[index] ? '完成' : '編輯'}
											</Button>
											{!address.defaultAdd && (
												<Button
													variant="contained"
													sx={{
														color: '#FFF',
														background: '#fe6f67',
														'&:hover': {
															background: '#fe6f67',
														},
													}}
													onClick={() => handleDelete(address.id)}
												>
													刪除
												</Button>
											)}
										</div>
									</div>
								</li>
								{index < addresses.length - 1 && <hr />}
							</React.Fragment>
						))}
					</ul>
				</div>
			</UserBox>
			<Footer bgColor="#fcf3ea" />
		</>
	);
}

export default withAuth(Address);
