import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import PurchaseCard from '@/components/purchase-card';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';
import { FaSearch } from 'react-icons/fa';

export default function Purchase() {
	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-column py-5 gap-5 w-100">
					<div className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}>
						<input
							type="text"
							className="px-3"
							placeholder="透過賣家名稱、訂單編號或商品名稱搜尋"
						/>
						<button className={Styles['TIL-searchBtn']}>
							<FaSearch size={25} className={Styles['TIL-FaSearch']} />
						</button>
					</div>
					<div className="px-3 px-md-0 d-flex flex-column gap-3">
						{/* 標籤分頁 */}
						<ul className={`${Styles['nav']} ${Styles['nav-pills']} mb-4`}>
							<li className={`${Styles['nav-item']}`}>
								<a
									className={`${Styles['nav-link']} ${Styles['active']}`}
									aria-current="page"
									href="#"
								>
									全部
								</a>
							</li>
							<li className={`${Styles['nav-item']}`}>
								<a className={`${Styles['nav-link']}`} href="#">
									已完成
								</a>
							</li>
							<li className={`${Styles['nav-item']}`}>
								<a className={`${Styles['nav-link']}`} href="#">
									已取消
								</a>
							</li>
						</ul>
						{/* 卡片 */}
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
