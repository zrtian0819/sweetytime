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

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/shop')
			.then((response) => {
				setShop(response.data);
				setFilteredShops(response.data);
			})
			.catch((error) => console.error('Error fetching users:', error));
	}, []);

	// 收藏用
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

	const toggleFavorite = async (shopId) => {
		try {
			if (likedItems.includes(shopId)) {
				await axios.delete(`/api/favorites/${shopId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLikedItems((prev) => prev.filter((id) => id !== shopId));
			} else {
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
			if (error.response) {
				console.log('伺服器回應狀態碼:', error.response.status);
				console.log('伺服器回應內容:', error.response.data);
			} else {
				console.log('無法連接到伺服器');
			}
		}
	};

	const applyFilters = () => {
		axios
			.get('http://localhost:3005/api/shop')
			.then((response) => {
				let filteredData = response.data;

				// 使用模糊篩選
				if (keyword) {
					filteredData = filteredData.filter((shop) =>
						shop.name.toLowerCase().includes(keyword.toLowerCase())
					);
				}

				if (region) {
					filteredData = filteredData.filter((shop) => shop.address.includes(region));
				}

				if (sortOrder === 'asc') {
					filteredData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
				} else if (sortOrder === 'desc') {
					filteredData = filteredData.sort((a, b) => b.name.localeCompare(a.name));
				}
				setFilteredShops(filteredData);
				setCurrentPage(1); // 每次篩選後回到第一頁
			})
			.catch((error) => console.error('Error fetching shops:', error));
	};
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
			<Footer />
		</>
	);
}
