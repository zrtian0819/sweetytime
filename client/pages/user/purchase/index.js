import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Styles from '@/styles/user.module.scss';

import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import PurchaseCard from '@/components/purchase-card';
import Pagination from '@/components/pagination';
import { withAuth } from '@/components/auth/withAuth';

import { FaSearch } from 'react-icons/fa';
import { useUser } from '@/context/userContext';

function UserPurchase() {
	const { user } = useUser();
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	
	// 設定每頁顯示數量
	const ITEMS_PER_PAGE = 3;

	// 搜尋訂單
	const filteredOrders = orders.filter((order) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			order.delivery_name.toLowerCase().includes(searchLower) ||
			order.order_id.toString().includes(searchLower)
		);
	});

	// 計算總頁數
	const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

	// 計算當前頁顯示的資料範圍
	const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
	const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
	const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

	// 獲取訂單列表
	const fetchOrders = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const accessToken = localStorage.getItem('accessToken');

			if (!accessToken) {
				throw new Error('No access token available');
			}

			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/orders/details`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (response.data.success) {
				setOrders(response.data.data);
			} else {
				throw new Error(response.data.message || '獲取訂單失敗');
			}
		} catch (error) {
			console.error('Fetch orders error:', error);
			setError(error.message || '獲取訂單資料失敗');
		} finally {
			setIsLoading(false);
		}
	};

	// 當用戶狀態改變時重新獲取訂單
	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			fetchOrders();
		}
	}, [user]);

	// 處理搜尋
	const handleSearch = (e) => {
		e.preventDefault();
		setCurrentPage(1); // 重置到第一頁
	};

	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-column py-5 gap-5 w-100">
					<form
						className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}
						onSubmit={handleSearch}
					>
						<input
							type="text"
							className="px-3"
							placeholder="透過賣家名稱、訂單編號或商品名稱搜尋"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button type="submit" className={`${Styles['TIL-Btn']} btn p-0`}>
							<FaSearch size={25} className={Styles['TIL-Fa']} />
						</button>
					</form>

					{/* 顯示訂單部分 */}
					<div className="px-3 px-md-0 d-flex flex-column gap-3">
						{isLoading ? (
							<div className="text-center">載入中...</div>
						) : error ? (
							<div className="text-center text-danger">{error}</div>
						) : currentItems.length === 0 ? (
							<div className="text-center">沒有找到訂單</div>
						) : (
							currentItems.map((item) => (
								<PurchaseCard key={item.order_id} {...item} />
							))
						)}
					</div>

					{/* 分頁組件 */}
					{!isLoading && !error && currentItems.length > 0 && (
						<div className="m-auto">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
								changeColor="#fe6f67"
							/>
						</div>
					)}
				</div>
			</UserBox>
			<Footer />
		</>
	);
}
export default withAuth(UserPurchase);
