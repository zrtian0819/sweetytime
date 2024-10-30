import React, { useState } from 'react';
import Styles from '@/components/user/userSideBar/userSideBar.module.scss';
import Img from 'next/image';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { FaPen } from 'react-icons/fa';

export default function UserSideBar() {
	const [open, setOpen] = useState([false, false, false, false]);

	const handleClick = (index) => {
		const newOpen = open.map((isOpen, i) => (i === index ? !isOpen : isOpen));
		setOpen(newOpen);
	};

	const menuItems = [
		{
			id: 0,
			icon: '/icon/account.svg',
			label: '我的帳戶',
			subItems: ['個人檔案', '地址管理'],
		},
		{
			id: 1,
			icon: '/icon/box-outline.svg',
			label: '我的收藏',
			subItems: ['收藏商品', '收藏店家', '收藏課程'],
		},
		{
			id: 2,
			icon: '/icon/symbols_list.svg',
			label: '購買清單',
			subItems: ['歷史訂單', '我的課程'],
		},
		{
			id: 3,
			icon: '/icon/coupon-line.svg',
			label: '會員好康',
			subItems: [],
		},
	];

	return (
		<div className={`${Styles['TIL-user-left']} mx-auto d-flex flex-column`}>
			<div className={`${Styles['TIL-bg']} d-flex flex-column gap-4 py-5`}>
				<div className={`${Styles['TIL-user-image']} mx-auto`}>
					<Img
						src="/photos/users/user_panda.png"
						alt="頭像"
						width={100}
						height={100}
						className="rounded-circle object-fit-cover shadow-sm w-100"
					/>
				</div>
				<div className={`${Styles['CTH-header-right']} d-block d-md-none text-center ms-2`}>
					<h1 className="mb-3">AiBao_baoFamily0524</h1>
					<button className={`${Styles['CTH-btn']} d-flex align-items-center m-auto`}>
						<div className="me-2">管理個人資料</div>
						<FaPen />
					</button>
				</div>
			</div>

			{/* 導航欄 */}
			<div
				className={`${Styles['TIL-navBar']} d-flex flex-row gx-2 gy-2 p-2 flex-md-column m-0`}
			>
				{menuItems.map((item) => (
					<div key={item.id} className="">
						<List className="d-flex flex-column align-items-center">
							<ListItemButton
								className={`${Styles['TIL-nav']} `}
								onClick={() => handleClick(item.id)}
							>
								<Img src={item.icon} width={25} height={25} className="me-2" />
								<ListItemText primary={item.label} />
							</ListItemButton>
							<Collapse in={open[item.id]} timeout="auto" unmountOnExit>
								<List
									component="div"
									disablePadding
									className={`${Styles['TIL-items-box']} justify-content-end`}
								>
									{item.subItems.map((subItem) => (
										<ListItemButton
											key={subItem}
											sx={{ pl: 4, justifyContent: 'flex-end' }}
											className={Styles['TIL-items']}
										>
											<ListItemText primary={subItem} />
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
