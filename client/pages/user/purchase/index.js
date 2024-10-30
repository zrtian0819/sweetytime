import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserLeft from '@/components/user-left';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';
import Image from 'next/image';

export default function Purchase() {
	const shop = {
		shop_id: 1,
		name: '花磚甜點',
		logo_path: 'SYRUP_LESS_logo.png',
	};
	return (
		<>
			<Header />
			<div className={`${Styles['TIL-body']} mt-5 d-none d-md-flex flex-column container`}>
				<div className={`${Styles['TIL-userbody']}`}>
					<UserLeft />
					<div className={`${Styles['TIL-user-right']}`}>
						<div className={['TIL-search']}>
							<input type="text" placeholder="透過賣家名稱、訂單編號或商品名稱搜尋" />
						</div>
						<div className={Styles['TIL-content']}>
							<div className="w-100">
								<div className={Styles['TIL-ShopLogo']}>
									<Image
										src={`/photos/shop_logo/${shop.logo_path}`}
										alt="店家名稱"
										width={50}
										height={50}
										className="w-100 h-100 object-fit-contain"
									/>
								</div>
							</div>
							<div></div>
							<div></div>
						</div>
						<div className="m-auto">
							<Pagination
								currentPage={1}
								totalPages={5}
								onPageChange={() => {}}
								changeColor="#fe6f67"
							/>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
