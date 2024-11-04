import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import styles from '@/styles/shop.module.scss';
import ShopCard from '@/components/shop/shopCard';
import Banner from '@/components/shop/banner';
import Footer from '@/components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from '@/components/pagination';
import ShopSidebar from '@/components/shopSidebar';
import axios from 'axios';

const token = 'your-temporary-token';
export default function Index() {
	const [currentPage, setCurrentPage] = useState(1);
	const [likedItems, setLikedItems] = useState([]);
	const [shop, setShop] = useState([]);

	//分頁用
	const itemsPerPage = 20;
	const totalPages = Math.ceil(shop.length / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = shop.slice(indexOfFirstItem, indexOfLastItem);

	useEffect(() => {
		// 請求 shop 表數據
		axios
			.get('http://localhost:3005/api/shop')
			.then((response) => setShop(response.data))
			.catch((error) => console.error('Error fetching users:', error));
	}, []);

	//收藏用
	const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await axios.get('/api/favorites', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLikedItems(response.data.data.favorites);
			} catch (error) {
				console.error('無法取得收藏清單', error);
			}
		};
		if (token) fetchFavorites();
	}, [token]);

	// 切換收藏狀態
	const toggleFavorite = async (shopId) => {
		try {
			if (likedItems.includes(shopId)) {
				// 已收藏，發送 DELETE 請求移除
				await axios.delete(`/api/favorites/${shopId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLikedItems((prev) => prev.filter((id) => id !== shopId));
			} else {
				// 未收藏，發送 PUT 請求新增
				await axios.put(
					`/api/favorites/${shopId}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setLikedItems((prev) => [...prev, shopId]);
			}
		} catch (error) {
			console.error('無法切換收藏狀態', error);
			// 顯示具體的錯誤回應
			if (error.response) {
				console.log('伺服器回應狀態碼:', error.response.status);
				console.log('伺服器回應內容:', error.response.data);
			} else {
				console.log('無法連接到伺服器');
			}
		}
	};

	return (
		<>
			<Header />
			<div className="TIL-banner">
				<Banner />
			</div>
			<div className={`${styles['TIL-body']} container my-5`}>
				<div className="row">
					<div className="col-lg-2 d-none d-lg-block p-0">
						<ShopSidebar shop={shop} />
					</div>
					<div className="col-12 col-lg-10 d-flex flex-column gap-5">
						<div className="row">
							{currentItems.map((shop) => (
								<div className="col-6 col-md-4 col-lg-3 " key={shop.shop_id}>
									<ShopCard
										name={shop.name}
										img={shop.logo_path}
										originalLiked={likedItems.includes(shop.shop_id)}
										handleToggleLike={() => toggleFavorite(shop.shop_id)}
									/>
								</div>
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
				</div>
			</div>
			<Footer />
		</>
	);
}
