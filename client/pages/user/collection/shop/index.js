import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserLeft from '@/components/user-left';
import ShopCard from '@/components/shop/shopCard';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';

export default function Shop() {
	const mockShop = { shop_id: 1, name: '花磚甜點', logo: 'sugar_logo.png', fav: false };

	return (
		<>
			<Header />
			<div className={`${Styles['TIL-body']} mt-5 d-none d-md-flex flex-column container`}>
				<div className={`${Styles['TIL-userbody']}`}>
					<UserLeft />
					<div className={`${Styles['TIL-user-right']}`}>
						<div className="d-flex flex-row flex-wrap justify-content-center h-auto gap-5">
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
							<ShopCard
								shop={mockShop}
								onToggleFav={() => {}}
								initStateFav={mockShop.fav}
							/>
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
