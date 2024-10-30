import React, { useState } from 'react';
import Styles from '@/components/user-left/user-left.module.scss';
import Img from 'next/image';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { FaPen } from 'react-icons/fa';

export default function UserLeft(props) {
	const [open, setOpen] = useState([false, false, false]);

	const handleClick = (index) => {
		const newOpen = open.map((isOpen, i) => (i === index ? !isOpen : isOpen));
		setOpen(newOpen);
	};
	return (
		<>
			<div className={`${Styles['TIL-user-left']} m-0 d-flex flex-column gap-3`}>
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
					<div
						className={`${Styles['CTH-header-right']} d-block d-md-none text-center ms-2`}
					>
						<h1 className="mb-3">AiBao_baoFamily0524</h1>
						<button className={`${Styles['CTH-btn']} d-flex align-items-center m-auto`}>
							<div className="me-2">管理個人資料</div>
							<FaPen />
						</button>
					</div>
				</div>
				<div
					className={`${Styles['TIL-navBar']} d-flex container justify-content-center align-items-start align-items-md-center flex-row flex-md-column w-100 px-2 m-0`}
				>
					<List>
						<ListItemButton
							className={`${Styles['TIL-nav']}`}
							onClick={() => {
								handleClick(0);
							}}
						>
							<Img
								src={'/icon/account.svg'}
								width={25}
								height={25}
								className="me-1"
							/>
							<ListItemText primary="我的帳戶" />
							{open[0] ? '' : ''}
						</ListItemButton>
						<Collapse
							in={open[0]}
							timeout="auto"
							unmountOnExit
							className={Styles['TIL-nav']}
						>
							<List
								component="div"
								disablePadding
								className={Styles['TIL-items-box']}
							>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="個人檔案" />
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="地址管理" />
								</ListItemButton>
							</List>
						</Collapse>
					</List>
					<List>
						<ListItemButton
							className={`${Styles['TIL-nav']}`}
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
						<Collapse
							in={open[1]}
							timeout="auto"
							unmountOnExit
							className={Styles['TIL-nav']}
						>
							<List
								component="div"
								disablePadding
								className={Styles['TIL-items-box']}
							>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="收藏商品" />
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="收藏店家" />
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="收藏課程" />
								</ListItemButton>
							</List>
						</Collapse>
					</List>
					<List>
						<ListItemButton
							className={`${Styles['TIL-nav']}`}
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
						<Collapse
							in={open[2]}
							timeout="auto"
							unmountOnExit
							className={Styles['TIL-nav']}
						>
							<List
								component="div"
								disablePadding
								className={Styles['TIL-items-box']}
							>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="歷史訂單" />
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }} className={Styles['TIL-items']}>
									<ListItemText primary="我的課程" />
								</ListItemButton>
							</List>
						</Collapse>
					</List>
					<List>
						<ListItemButton onClick={handleClick} className={Styles['TIL-nav']}>
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
			</div>
		</>
	);
}
