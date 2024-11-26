import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Styles from '@/components/user/userSideBar/userSideBar.module.scss';
import Img from 'next/image';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { FaPen } from 'react-icons/fa';
import { useUser } from '@/context/userContext';
import UserAvatarUpload from './UserAvatarUpload';
import axios from 'axios';

export default function UserSideBar() {
	const router = useRouter();
	const { user } = useUser();
	const [open, setOpen] = useState([false, false, false, false]);

	const handleClick = (index) => {
		const newOpen = open.map((isOpen, i) => (i === index ? !isOpen : isOpen));
		setOpen(newOpen);
	};

	// 決定要顯示的圖片路徑
	const profileImageSrc = user?.portrait_path
		? `/photos/user/${user.portrait_path}` // 使用者上傳的照片
		: '/photos/users/user_panda.png'; // 預設圖片

		const handleImageUpload = async (file) => {
			try {
			  const token = localStorage.getItem('accessToken');
			  const formData = new FormData();
			  formData.append('avatar', file);
		  
			  // 使用 axios 正確的方式發送請求
			  const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/upload-avatar`,
				formData,  // 直接傳送 formData 作為 data
				{
				  headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'multipart/form-data'  // 設定正確的 Content-Type
				  }
				}
			  );
		  
			  // axios 會自動解析 JSON，所以直接使用 response.data
			  const { data } = response;
		  
			  if (data.success) {
				// 如果後端回傳新的 token，更新它
				if (data.token) {
				  localStorage.setItem('accessToken', data.token);
				}
		  
				// 重新載入頁面
				window.location.reload();
			  } else {
				throw new Error(data.message || '上傳失敗');
			  }
			} catch (error) {
			  console.error('上傳失敗:', error);
			  // axios 錯誤處理
			  const errorMessage = error.response?.data?.message || error.message || '上傳失敗，請稍後再試';
			  alert(errorMessage);
			}
		  };

	// 設定各個選項的路由路徑
	const menuItems = [
		{
			id: 0,
			icon: '/icon/account.svg',
			label: '我的帳戶',
			subItems: [
				{ label: '個人檔案', path: '/user/account/profile' },
				{ label: '地址管理', path: '/user/account/address' },
			],
		},
		{
			id: 1,
			icon: '/icon/box-outline.svg',
			label: '我的收藏',
			subItems: [
				{ label: '收藏商品', path: '/user/collection/product' },
				{ label: '收藏店家', path: '/user/collection/shop' },
				{ label: '收藏課程', path: '/user/collection/lesson' },
			],
		},
		{
			id: 2,
			icon: '/icon/symbols_list.svg',
			label: '購買清單',
			subItems: [
				{ label: '歷史訂單', path: '/user/purchase' },
				{ label: '課程訂單', path: '/user/purchase/lesson_purchase' },
			],
		},
		{
			id: 3,
			icon: '/icon/coupon-line.svg',
			label: '會員好康',
			subItems: [{ label: '會員優惠券', path: '/user/voucher-wallet' }],
		},
	];

	// 處理個人資料按鈕點擊
	const handleProfileManagement = () => {
		router.push('/user/account/profile');
	};

	// 處理子項目點擊
	const handleSubItemClick = (path) => {
		router.push(path);
	};

	return (
		<div className={`${Styles['TIL-user-left']} mx-auto d-flex flex-column`}>
			<div className={`${Styles['TIL-bg']} d-flex flex-column gap-4 py-5`}>
				<div className={`${Styles['TIL-user-image']} mx-auto`}>
					<UserAvatarUpload
						currentImage={profileImageSrc}
						onImageUpload={handleImageUpload}
					/>
				</div>
				<div className={`${Styles['CTH-header-right']} d-block d-md-none text-center ms-2`}>
					<h1 className="mb-3">{user?.name || 'User'}</h1>
					<button
						className={`${Styles['CTH-btn']} d-flex align-items-center m-auto`}
						onClick={handleProfileManagement}
					>
						<div className="me-2">管理個人資料</div>
						<FaPen />
					</button>
				</div>
			</div>

			{/* 導航欄 */}
			<div
				className={`${Styles['TIL-navBar']} d-flex flex-row flex-md-column m-0`}
			>
				{menuItems.map((item) => (
					<div key={item.id} className="">
						<List className="d-flex flex-column align-items-center">
							<ListItemButton
								className={`${Styles['TIL-nav']} `}
								onClick={() => handleClick(item.id)}
							>
								<Img src={item.icon} width={25} height={25} className={`${Styles['TIL-nav-img']}`} />
								<ListItemText primary={item.label} className={`${Styles['TIL-nav-span']} `} />
							</ListItemButton>
							<Collapse in={open[item.id]} timeout="auto" unmountOnExit>
								<List
									component="div"
									disablePadding
									className={`${Styles['TIL-items-box']} justify-content-end`}
								>
									{item.subItems.map((subItem) => (
										<ListItemButton
											key={subItem.label}
											sx={{ pl: 4, justifyContent: 'flex-end' }}
											className={Styles['TIL-items']}
											onClick={() => handleSubItemClick(subItem.path)}
										>
											<ListItemText primary={subItem.label} />
										</ListItemButton>
									))}
								</List>
							</Collapse>
						</List>
					</div>
				))}
			</div>
		</div>
	);
}
