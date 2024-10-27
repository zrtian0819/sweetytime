import React, { useState, useEffect } from 'react';
import Styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';

// 功能還沒寫

export default function Header(props) {
	const [navOpen, setNavOpen] = useState(false);
	return (
		<>
			<header className={Styles['header']}>
				<Link href={'/teacher'} className={Styles['bigLink']}>
					Teachers
				</Link>

				<Link href={'/lesson'} className={Styles['bigLink']}>
					Lessons
				</Link>

				<Link href={'/product'} className={Styles['bigLink']}>
					Shop
				</Link>

				<div className={Styles['halfCircle']}>
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

				<Link href={'/news'} className={Styles['bigLink']}>
					News
				</Link>

				<Link href={'/shop'} className={Styles['bigLink']}>
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

				<Link href={'/'} className={Styles['smallLink']}>
					<Image src={'/icon/sweet_time_logo1.png'} alt="" width={74} height={40} />
				</Link>
				<Link
					href=""
					className={`${Styles['smallLink']} ZRT-click`}
					onClick={() => {
						setNavOpen(!navOpen);
					}}
				>
					<Image src={'/icon/navButton.svg'} alt="" width={25} height={25} />
				</Link>

				<div className={`${navOpen ? Styles['navMobile'] : Styles['navMobileClosed']}`}>
					<ul className={Styles['navList']}>
						<li className={Styles['navOption']}>
							<Link href={'/product'} className={Styles['linkText']}>
								Products
							</Link>
						</li>
						<li className={Styles['navOption']}>
							<Link href={'/shop'} className={Styles['linkText']}>
								Shops
							</Link>
						</li>
						<li className={Styles['navOption']}>
							<Link href={'/lesson'} className={Styles['linkText']}>
								Lessons
							</Link>
						</li>
						<li className={Styles['navOption']}>
							<Link href={'/teacher'} className={Styles['linkText']}>
								Teachers
							</Link>
						</li>
						<li className={Styles['navOption']}>
							<Link href={'/news'} className={Styles['linkText']}>
								News
							</Link>
						</li>
						<li className={Styles['navOption']}>
							<Link href={'/login'} className={Styles['linkText']}>
								My Account
							</Link>
						</li>
						<li className={Styles['navOption']}>
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
