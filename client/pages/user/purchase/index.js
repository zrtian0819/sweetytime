import React, { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import PurchaseCard from '@/components/purchase-card';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';
import { FaSearch } from 'react-icons/fa';
import { withAuth } from '@/components/auth/withAuth';//引入登入檢查

//假資料測試用
const order = [
	{
		order_id: 1,
		status: 'completed',
		user_id: 101,
		shop_id: 1,
		coupon_id: 5,
		delivery_address: '123 Main St, Taipei',
		delivery_name: 'Alice Lin',
		delivery_phone: '0987654321',
		order_time: '2024-11-01 12:00:00',
		total_price: 1200,
	},
	{
		order_id: 2,
		status: 'cancelled',
		user_id: 102,
		shop_id: 2,
		coupon_id: null,
		delivery_address: '456 Pine St, New Taipei',
		delivery_name: 'Bob Wang',
		delivery_phone: '0912345678',
		order_time: '2024-11-01 13:15:00',
		total_price: 850,
	},
	{
		order_id: 3,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 4,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 5,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 6,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 7,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 8,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 9,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
	{
		order_id: 10,
		status: 'pending',
		user_id: 103,
		shop_id: 1,
		coupon_id: 2,
		delivery_address: '789 Oak St, Taichung',
		delivery_name: 'Cindy Chen',
		delivery_phone: '0928765432',
		order_time: '2024-11-01 14:30:00',
		total_price: 980,
	},
];

function UserPurchase() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 2;

	// 計算總頁數
	const totalPages = Math.ceil(order.length / itemsPerPage);

	// 計算當前頁顯示的資料範圍
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = order.slice(indexOfFirstItem, indexOfLastItem);

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
						<button className={`${Styles['TIL-Btn']} btn p-0`}>
							<FaSearch size={25} className={Styles['TIL-Fa']} />
						</button>
					</div>
					<div className="px-3 px-md-0 d-flex flex-column gap-3">
						{/* 顯示分頁資料的卡片 */}
						{currentItems.map((item) => (
							<PurchaseCard key={item.order_id} {...item} />
						))}
					</div>
					<div className="m-auto">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={(page) => setCurrentPage(page)}
							changeColor="#fe6f67"
						/>
					</div>
				</div>
			</UserBox>
			<Footer />
		</>
	);
}
export default withAuth(UserPurchase);