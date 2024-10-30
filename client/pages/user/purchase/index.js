import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
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
			<UserBox>
				<div className="d-flex flex-column py-5 p-md-0 gap-3">
					<div className={`${Styles['TIL-search']} w-100 d-flex justify-content-center`}>
						<input
							type="text"
							className="ps-3"
							placeholder="透過賣家名稱、訂單編號或商品名稱搜尋"
						/>
					</div>
					<div className={Styles['TIL-content']}>
						<div className="">
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
			</UserBox>
			<Footer />
		</>
	);
}
