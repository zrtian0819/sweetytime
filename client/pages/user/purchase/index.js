import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import PurchaseCard from '@/components/purchase-card';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';

export default function Purchase() {
	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-column py-5 gap-5 w-100">
					<div className={`${Styles['TIL-search']} d-flex justify-content-center`}>
						<input
							type="text"
							className="ps-3"
							placeholder="透過賣家名稱、訂單編號或商品名稱搜尋"
						/>
					</div>
					<div className="px-3 px-md-0 d-flex flex-column gap-3">
						<PurchaseCard />
						<PurchaseCard />
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
