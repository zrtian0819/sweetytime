import React from 'react';
import Styles from './user-left.module.scss';
import Img from 'next/image';

export default function Header(props) {
	return (
		<>
			<div className={`${Styles['TIL-user-left']}`}>
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
						<a className={`${Styles['TIL-user-left-menu-active']}`}>
							我的帳戶
						</a>
						<ul className={`${Styles['TIL-user-left-submenu']}`}>
							<li>
								<a className={`${Styles['TIL-user-left-submenu-active']}`} href="profile">
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
						<a href="../voucher-wallet">會員好康</a>
					</li>
				</ul>
			</div>
		</>
	);
}
