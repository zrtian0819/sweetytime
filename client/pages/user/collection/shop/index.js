import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import ShopCard from '@/components/shop/shopCard';
import Pagination from '@/components/pagination';

export default function Shop() {
	const mockShop = { shop_id: 1, name: '花磚甜點', logo: 'sugar_logo.png', fav: false };

	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-column py-5 p-md-0 gap-3">
					<div className="d-flex flex-row flex-wrap justify-content-center gap-5">
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
			</UserBox>
			<Footer />
		</>
	);
}
