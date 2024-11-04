import React, { useState, useEffect } from 'react';
import Styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import MenuButton from '../menuButton';
import { useCart } from '@/context/cartContext';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Header(props) {
	const [navOpen, setNavOpen] = useState(false);
	const { cart, handleCart } = useCart();
	const [user, setUser] = useState(null);
	const router = useRouter();

	// const handleAccountClick = (e) => {
	// 	e.preventDefault(); // 防止Link默認行為
	// 	if (session) {
	// 		router.push('/user/account/profile');
	// 	} else {
	// 		router.push('/login');
	// 	}
	// };

	// 在組件加載時獲取用戶資料
	useEffect(() => {
		// 從localStorage獲取用戶資料
		const userData = JSON.parse(localStorage.getItem('user'));
		setUser(userData);
	}, []);

	const handleAccountClick = (e) => {
		e.preventDefault();
		if (user) {
			// 使用 user 替代 session 來判斷
			router.push('/user/account/profile');
		} else {
			router.push('/login');
		}
	};

	// 處理登出
	const handleLogout = () => {
		localStorage.removeItem('user'); // 清除用戶資料
		setUser(null); // 更新狀態
		router.push('/'); // 導航到首頁或其他適當頁面
	};

	return (
		<>
			<header className={`${Styles['header']}`}>
				{/* <div className={`${Styles['centerLine']}`}> 檢查對齊用 </div> */}
				<div className={`${Styles['leftArea']} ps-sm-4 ps-lg-5 pe-lg-5`}>
					<Link href={'/teacher'} className={`${Styles['bigLink']} space-control`}>
						Teachers
					</Link>

					<Link href={'/lesson'} className={`${Styles['bigLink']} space-control`}>
						Lessons
					</Link>

					<Link href={'/product'} className={`${Styles['bigLink']} space-control`}>
						Shop
					</Link>
				</div>
				<div className={`${Styles['halfCircle']} mx-sm-1 mx-md-4 mx-lg-5`}>
					<Link href={'/'}>
						<Image
							className={Styles['logo']}
							src={'/icon/sweet_time_logo1.png'}
							alt=""
							width={93}
							height={50}
						/>
					</Link>
				</div>
				<div className={`${Styles['rightArea']} ps-lg-5 pe-lg-5 pe-sm-3`}>
					<Link href={'/news'} className={`${Styles['bigLink']} space-control`}>
						News
					</Link>

					<Link href={'/shop'} className={`${Styles['bigLink']} space-control`}>
						Partner Stores
					</Link>

					<div className={`${Styles['icons']} ${Styles['bigLink']}`}>
						<a href="#" onClick={handleAccountClick} className={Styles['icon']}>
							<Image src={'/icon/portrait.svg'} alt="" width={30} height={30} />
						</a>
						<Link href={'/cart'} className={`${Styles['ZRT-cartIcon']}`}>
							<Image src={'/icon/cart.svg'} alt="" width={25} height={25} />
							{cart.length == 0 ? (
								''
							) : (
								<div className={`${Styles['ZRT-cartNumber']} ZRT-center`}>
									{handleCart(cart, '_', 'countNumber')}
								</div>
							)}
						</Link>
						{/* 登出按鈕 */}
						{user && ( // 使用 user 替代 session
							<button
								onClick={handleLogout} // 使用新的 handleLogout 函數
								className={`${Styles['WGS-logoutBtn']}`}
							>
								登出
							</button>
						)}
					</div>
				</div>

				{/* -----------------手機板------------------ */}
				<Link href={'/'} className={`${Styles['smallLink']} ${Styles['mobileLogo']}`}>
					<Image src={'/icon/sweet_time_logo1.png'} alt="" width={74} height={40} />
				</Link>

				<MenuButton
					className={`${Styles['menuButton']}`}
					navOpen={navOpen}
					setNavOpen={setNavOpen}
					onClick={() => {
						setNavOpen(!navOpen);
					}}
				/>

				<div className={`${navOpen ? Styles['navMobile'] : Styles['navMobileClosed']}`}>
					<ul className={Styles['navList']}>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<Link href={'/teacher'} className={Styles['linkText']}>
								Teachers
							</Link>
						</li>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<Link href={'/lesson'} className={Styles['linkText']}>
								Lessons
							</Link>
						</li>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<Link href={'/product'} className={Styles['linkText']}>
								Shop
							</Link>
						</li>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<Link href={'/news'} className={Styles['linkText']}>
								News
							</Link>
						</li>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<Link href={'/shop'} className={Styles['linkText']}>
								Partner Stores
							</Link>
						</li>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<a href="#" onClick={handleAccountClick} className={Styles['linkText']}>
								My Account
							</a>
						</li>
						<li
							className={`${
								navOpen ? Styles['navOption'] : Styles['navOptionClosed']
							}`}
						>
							<Link href={'/cart'} className={Styles['linkText']}>
								Cart
							</Link>
						</li>
						{user && ( // 使用 user 替代 session
							<li
								className={`${
									navOpen ? Styles['navOption'] : Styles['navOptionClosed']
								}`}
							>
								<button
									onClick={handleLogout}
									className={`${Styles['WGS-logoutBtn']} ${Styles['linkText']}`}
								>
									登出
								</button>
							</li>
						)}
					</ul>
				</div>
			</header>
		</>
	);
}
