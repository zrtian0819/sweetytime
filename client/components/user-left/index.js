import React, { useState } from 'react';
import Styles from './user-left.module.scss';
import Img from 'next/image';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

export default function Header(props) {
	const [open, setOpen] = useState([false, false, false]);

	const handleClick = (index) => {
		const newOpen = open.map((isOpen, i) => (i === index ? !isOpen : isOpen));
		setOpen(newOpen);
	};
	return (
		<>
			<div className={`${Styles['TIL-user-left']} d-none d-md-flex`}>
				<div className={`${Styles['TIL-user-left-menu-picHead']}`}>
					<Img
						src="/photos/users/user_panda.png"
						alt="頭像"
						width={100}
						height={100}
						className="rounded-circle object-fit-cover shadow-sm"
					/>
				</div>
				<ul className={`${Styles['TIL-user-left-menu']}`}>
					<li>
						<a className={`${Styles['TIL-user-left-menu-active']}`}>我的帳戶</a>
						<ul className={`${Styles['TIL-user-left-submenu']}`}>
							<li>
								<a
									className={`${Styles['TIL-user-left-submenu-active']}`}
									href="profile"
								>
									個人檔案
								</a>
							</li>
							<li>
								<a href="payment">付費方式</a>
							</li>
							<li className="active">
								<a href="address">地址管理</a>
							</li>
							<li>
								<a href="#">更改密碼</a>
							</li>
						</ul>
					</li>
					<li>
						<a href="#">我的收藏</a>
						<ul className={`${Styles['TIL-user-left-submenu']}`}>
							<li>
								<a href="#">收藏店家</a>
							</li>
							<li>
								<a href="#">商藏商品</a>
							</li>
							<li>
								<a href="#">收藏課程</a>
							</li>
						</ul>
					</li>
					<li>
						<a href="#">購買清單</a>
					</li>
					<li>
						<a href="#">會員好康</a>
					</li>
				</ul>
			</div>

			<div className="container d-flex justify-content-center d-md-none">
				<List>
					<ListItemButton
						onClick={() => {
							handleClick(0);
						}}
					>
						<Img src={'/icon/account.svg'} width={25} height={25} className="me-1" />
						<ListItemText primary="我的帳戶" />
						{open[0] ? '' : ''}
					</ListItemButton>
					<Collapse in={open[0]} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="個人檔案" />
							</ListItemButton>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="地址管理" />
							</ListItemButton>
						</List>
					</Collapse>
				</List>
				<List>
					<ListItemButton
						onClick={() => {
							handleClick(1);
						}}
					>
						<Img
							src={'/icon/box-outline.svg'}
							width={25}
							height={25}
							className="me-2"
						/>
						<ListItemText primary="我的收藏" />
						{open[1] ? '' : ''}
					</ListItemButton>
					<Collapse in={open[1]} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="收藏商品" />
							</ListItemButton>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="收藏店家" />
							</ListItemButton>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="收藏課程" />
							</ListItemButton>
						</List>
					</Collapse>
				</List>
				<List>
					<ListItemButton
						onClick={() => {
							handleClick(2);
						}}
					>
						<Img
							src={'/icon/symbols_list.svg'}
							width={25}
							height={25}
							className="me-2"
						/>
						<ListItemText primary="購買清單" />
						{open[2] ? '' : ''}
					</ListItemButton>
					<Collapse in={open[2]} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="歷史訂單" />
							</ListItemButton>
							<ListItemButton sx={{ pl: 4 }}>
								<ListItemText primary="我的課程" />
							</ListItemButton>
						</List>
					</Collapse>
				</List>
				<List>
					<ListItemButton onClick={handleClick}>
						<Img
							src={'/icon/coupon-line.svg'}
							width={25}
							height={25}
							className="me-2"
						/>
						<ListItemText primary="會員好康" />
					</ListItemButton>
				</List>
			</div>
		</>
	);
}
