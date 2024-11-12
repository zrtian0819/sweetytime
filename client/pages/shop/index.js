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

axios.defaults.baseURL = 'http://localhost:3005/api'; // 設定伺服器基本URL

export default function Index() {
	const [currentPage, setCurrentPage] = useState(1);
	const [likedItems, setLikedItems] = useState([]);
	const [shop, setShop] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [region, setRegion] = useState('');
	const [sortOrder, setSortOrder] = useState('');
	const [filteredShops, setFilteredShops] = useState([]);

	const itemsPerPage = 12;
	const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredShops.slice(indexOfFirstItem, indexOfLastItem);

	// Token 取得
	const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

	// 初始化獲取商店資料和收藏清單
	useEffect(() => {
		console.log('Token:', token);
		const fetchData = async () => {
			try {
				// 獲取商店列表
				const shopResponse = await axios.get('/shop');
				setShop(shopResponse.data);
				setFilteredShops(shopResponse.data);

				// 若有 Token，則取得收藏清單
				if (token) {
					const favoritesResponse = await axios.get('/favorites/shop', {
						headers: { Authorization: `Bearer ${token}` },
					});
					setLikedItems(favoritesResponse.data.data.favorites);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, [token]);

	// 切換收藏狀態
	const toggleFavorite = async (shopId) => {
		console.log('shopId:', shopId);
		try {
			if (likedItems.includes(shopId)) {
				// 若已收藏，則刪除收藏
				await axios.delete(`/favorites/shop/${shopId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setLikedItems((prev) => prev.filter((id) => id !== shopId));
			} else {
				// 若未收藏，則新增收藏
				await axios.put(
					`/favorites/shop/${shopId}`,
					{},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setLikedItems((prev) => [...prev, shopId]);
			}
		} catch (error) {
			console.error('無法切換收藏狀態', error);
			if (error.response) {
				console.log('伺服器回應狀態碼:', error.response.status);
				console.log('伺服器回應內容:', error.response.data);
			} else {
				console.log('無法連接到伺服器');
			}
		}
	};

	const applyFilters = () => {
		let filteredData = [...shop]; // 從初始的商店列表過濾

		// 關鍵字篩選
		if (keyword) {
			filteredData = filteredData.filter((shop) =>
				shop.name.toLowerCase().includes(keyword.toLowerCase())
			);
		}

		// 區域篩選
		if (region) {
			filteredData = filteredData.filter((shop) => shop.address.includes(region));
		}

		// 排序
		if (sortOrder === 'asc') {
			filteredData.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortOrder === 'desc') {
			filteredData.sort((a, b) => b.name.localeCompare(a.name));
		}

		setFilteredShops(filteredData);
		setCurrentPage(1); // 每次篩選後回到第一頁
	};

	// 重設篩選條件
	const onRecover = () => {
		setKeyword('');
		setRegion('');
		setSortOrder('');
		setFilteredShops(shop);
		setCurrentPage(1);
	};

	return (
		<>
			<Header />
			<div className="TIL-banner">
				<Banner
					onKeywordChange={setKeyword}
					onRegionChange={setRegion}
					onSortChange={setSortOrder}
					applyFilters={applyFilters}
					onRecover={onRecover}
					keyword={keyword}
					region={region}
					sortOrder={sortOrder}
				/>
			</div>
			<div className={`${styles['TIL-body']} my-5 px-md-3 gap-md-3`}>
				<div className={`${styles['sidebar-container']}`}>
					<ShopSidebar
						styles={{
							maxHeight: '100%',
							position: 'absolute',
							top: '0',
							left: '0',
						}}
					/>
				</div>
				<div className={`${styles['TIL-items']} gap-3`}>
					<div className={`${styles['TIL-content']}`}>
						{currentItems.map((shop) => (
							<div className="col-6 col-lg-4 col-xl-3" key={shop.shop_id}>
								<ShopCard
									shop={shop}
									originalLiked={likedItems.includes(shop.id)}
									handleToggleLike={() => toggleFavorite(shop.id)}
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
			<Footer />
		</>
	);
}
