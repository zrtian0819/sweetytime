import React, { useState, useEffect } from 'react';
import Styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import MenuButton from '../menuButton';

// 功能還沒寫

export default function Header(props) {
	const [navOpen, setNavOpen] = useState(false);
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
						<Link href={'/login'} className={Styles['icon']}>
							<Image src={'/icon/portrait.svg'} alt="" width={30} height={30} />
						</Link>
						<Link href={'/cart'}>
							<Image src={'/icon/cart.svg'} alt="" width={25} height={25} />
						</Link>
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
							<Link href={'/login'} className={Styles['linkText']}>
								My Account
							</Link>
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
					</ul>
				</div>
			</header>
		</>
	);
}
