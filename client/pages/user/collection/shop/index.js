import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import UserBox from '@/components/user/userBox';
import ShopCard from '@/components/user/collection/shopCard';
import Pagination from '@/components/pagination';
import Styles from '@/styles/user.module.scss';
import { FaSearch } from 'react-icons/fa';
import { withAuth } from '@/components/auth/withAuth'; //引入登入檢查
import axios from 'axios';

function UserShop() {
	const [shops, setShops] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');

	// 獲取店家數據
	const fetchShops = async (page, search = '') => {
		const token = localStorage.getItem('accessToken');
		try {
			setLoading(true);
			const token = localStorage.getItem('accessToken');
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/collection/shop`,
				{
					params: {
						page,
						search,
						limit: 6, // 每頁顯示6個店家
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('API 回應原始資料:', response.data);
			let shopData;
			if (Array.isArray(response.data.data)) {
				shopData = response.data.data;
			} else if (Array.isArray(response.data.shops)) {
				shopData = response.data.shops;
			} else {
				console.error('無法解析店家資料，API 回應:', response.data);
				shopData = [];
			}
			console.log('處理後的店家資料:', shopData); // 記錄處理後的店家資料

			const totalPagesData = response.data.totalPages || Math.ceil(shopData.length / 6) || 1;
			console.log('總頁數:', totalPagesData); // 記錄總頁數

			setShops(shopData);
			setTotalPages(totalPagesData);
			setError(null);
		} catch (err) {
			console.error('錯誤詳情:', err.response || err);
			setError('無法載入店家數據');
		} finally {
			setLoading(false);
		}
	};

	// 初始載入和頁面變化時獲取數據
	useEffect(() => {
		fetchShops(currentPage, searchTerm);
	}, [currentPage]);

	// 處理搜索
	const handleSearch = (e) => {
		e.preventDefault();
		setCurrentPage(1); // 重置到第一頁
		fetchShops(1, searchTerm);
	};


	if (loading) {
		return (
			<>
				<Header />
				<UserBox>
					<div className="text-center py-5">載入中...</div>
				</UserBox>
				<Footer bgColor="#fcf3ea" />
			</>
		);
	}

	return (
		<>
			<Header />
			<UserBox>
				<div className="d-flex flex-column py-5 p-md-0 gap-3">
					<form
						className={`${Styles['TIL-search']} d-flex justify-content-center gap-2`}
						onSubmit={handleSearch}
					>
						<input
							type="text"
							className="px-3"
							placeholder="透過店家名稱搜尋"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button type="submit" className={`${Styles['TIL-Btn']} btn p-0`}>
							<FaSearch size={25} className={Styles['TIL-Fa']} />
						</button>
					</form>

					{loading && <div className="text-center">載入中...</div>}

					{error && <div className="text-center text-danger">{error}</div>}

					<div className="d-flex flex-column flex-wrap justify-content-center gap-2">
						{shops.map((shop) => {
							console.log('正在傳遞的店家資料:', shop);
							return (
								<ShopCard
									key={shop.id}
									shop={shop}
									onToggleFav={() => {}}
									initStateFav={shop.fav}
								/>
							);
						})}
					</div>

					{!loading && shops.length === 0 && (
						<div className="text-center">沒有找到相關店家</div>
					)}
				</div>
			</UserBox>
			<Footer />
		</>
	);
}
export default withAuth(UserShop);
