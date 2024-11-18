import React, { useState, useEffect } from 'react';
import Styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import MenuButton from '../menuButton';
import { useCart } from '@/context/cartContext';
import { useUser } from '@/context/userContext';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { FaCartShopping } from 'react-icons/fa6';
import { CgProfile } from 'react-icons/cg';
import axios from 'axios';

export default function Header(props) {
	const [navOpen, setNavOpen] = useState(false);
	const { cart, handleCart } = useCart();
	const { user, logout } = useUser();
	const [userObj, setUserObj] = useState(null);
	const router = useRouter();

	const handleAccountClick = (e) => {
		e.preventDefault();
		if (user) {
			// 判斷用戶角色
			if (user.role === 'user') {
				router.push('/user/account/profile');
			} else {
				router.push('/admin');
			}
		} else {
			router.push('/login');
		}
	};

	const handleCartClick = (e) => {
		e.preventDefault();
		if (user) {
			// 購物車功能通常只開放給一般用戶
			if (user.role === 'user') {
				router.push('/cart');
			} else {
				// 可以加入提示訊息告知管理員無法使用購物車功能
				alert('Admin accounts cannot access the shopping cart');
				// 或是導向管理頁面
				router.push('/admin');
			}
		} else {
			router.push('/login');
		}
	};

	// 處理登出
	const handleLogout = async () => {
		await logout(); // 使用 context 中的 logout 函數
		router.push('/');
	};

	useEffect(() => {
		(async () => {
			if (user) {
				try {
					const getUser = await axios.get('http://localhost:3005/api/user');
					const EveryUsers = getUser.data;
					const currentUser = EveryUsers.find((u) => u.id == user.id);

					if (!currentUser.portrait_path) {
						currentUser.portrait_path = 'default.png';
					}

					// console.log('currentUser:', currentUser);

					setUserObj(currentUser);
				} catch (e) {
					console.log('❌獲取使用者照片失敗:', e.message);
				}
			}
		})();
	}, [user]);

	return (
		<>
			<header className={`${Styles['header']}`}>
				{/* <div className={`${Styles['centerLine']}`}> 檢查對齊用 </div> */}
				<div className={`${Styles['leftArea']} ps-sm-4 ps-lg-5 pe-lg-5`}>
					<Link
						href={'/teacher'}
						className={`${Styles['bigLink']} space-control ZRT-click-fast`}
					>
						Teachers
					</Link>

					<Link
						href={'/lesson'}
						className={`${Styles['bigLink']} space-control ZRT-click-fast`}
					>
						Lessons
					</Link>

					<Link
						href={'/product'}
						className={`${Styles['bigLink']} space-control ZRT-click-fast`}
					>
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
					<Link
						href={'/news'}
						className={`${Styles['bigLink']} space-control ZRT-click-fast`}
					>
						News
					</Link>

					<Link
						href={'/shop'}
						className={`${Styles['bigLink']} space-control ZRT-click-fast`}
					>
						Partner Stores
					</Link>

					<div className={`${Styles['icons']} ${Styles['bigLink']} `}>
						<a
							href="#"
							onClick={handleAccountClick}
							className={`${Styles['icon']} ZRT-click-fast`}
						>
							{/* <Image src={'/icon/portrait.svg'} alt="" width={30} height={30} /> */}
							{userObj ? (
								<div className={`${Styles['photoIcon']}`}>
									<Image
										src={
											userObj
												? `/photos/user/${userObj.portrait_path}`
												: '/photos/user/default.png'
										}
										height={0}
										width={0}
										alt={userObj ? `/photos/user/${userObj.name}` : '無'}
									/>
								</div>
							) : (
								<CgProfile />
							)}
						</a>
						<Link
							href={'/cart'}
							onClick={handleCartClick}
							className={`${Styles['ZRT-cartIcon']} ZRT-click-fast`}
						>
							{/* <Image src={'/icon/cart.svg'} alt="" width={25} height={25} /> */}
							<FaCartShopping />
							{!user || cart.length == 0 ? (
								''
							) : (
								<div className={`${Styles['ZRT-cartNumber']} ZRT-center`}>
									{handleCart(cart, '_', 'countNumber')}
								</div>
							)}
						</Link>
						{/* 登出按鈕 */}
						{user && (
							<button
								onClick={handleLogout}
								className={`${Styles['WGS-logoutBtn']} ZRT-click-fast`}
								style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
							>
								<div style={{ marginLeft: '5px' }}>Log Out</div>
								<FiLogOut style={{ fontSize: '18px', marginLeft: '5px' }} />
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
