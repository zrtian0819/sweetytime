import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/productList.module.scss';
import Card from '@/components/product/productCard';
import Filter from '@/components/product/productFilter';
import IconClassFilter from '@/components/iconClassFilter';
import Tags from '@/components/product/tag';
import ShopSidebar from '@/components/shopSidebar';
import Pagination from '@/components/pagination';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import { showCustomToast } from '@/components/toast/CustomToastMessage';
import Swal from 'sweetalert2';

export default function Product() {
	const router = useRouter();

	const [products, setProducts] = useState([]);
	const [featuredShops, setFeaturedShops] = useState([]);
	const { user, logout } = useUser();

	// const [userLikedProducts, setUserLikedProducts] = useState([]);

	// 定義獲取商品資料的函數
	const fetchProducts = async () => {
		try {
			// 獲取所有商品資料
			const productsResponse = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`,
				{
					params: filterCriteria,
				}
			);
			const productsData = productsResponse.data;
			console.log('productsData:', productsData);

			// 創建已被此使用者收藏的商品的集合
			let likedProductIds = new Set();

			// 如果有使用者登入，獲取使用者喜歡的商品資料
			if (user) {
				const likedResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userLikedProducts?userId=${user.id}`
				);
				likedProductIds = new Set(likedResponse.data.map((item) => item.item_id));
				console.log('Liked Product IDs Set:', likedProductIds); // 檢查被收藏商品的 id 的集合
			}

			// 把"商品是否被收藏"加到每個商品的資料中
			const updatedProducts = productsData.map((product) => ({
				...product,
				isFavorited: likedProductIds.has(product.id),
			}));

			// console.log('Updated Products:', updatedProducts); // 確認更新後的產品資料

			// 一次性設置所有商品資料
			setProducts(updatedProducts);
			setCurrentPage(1);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		// fetchProducts();

		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product-featureShops`)
			.then((res) => setFeaturedShops(res.data))
			.catch((err) => console.error(err));
	}, [user]);

	// 如果從shop的來去逛逛按鈕跳轉過來
	useEffect(() => {
		if (!router.isReady) return;
		console.log('router is ready');

		const { shopId, shopName, shopLogo } = router.query;
		setFilterCriteria((prevCriteria) => ({
			...prevCriteria,
			shopId: shopId,
			shopName: shopName,
			shopLogo: shopLogo,
		}));
		setTriggerFetch(true);
	}, [router.isReady, router.query]);

	// 處理收藏功能
	const toggleFavorite = async (userId, productId, prevIsliked) => {
		if (user) {
			try {
				const response = await axios.post(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userLikedProducts`,
					{
						userId,
						productId,
					}
				);
				const { isFavorited } = response.data;

				setProducts((prevProducts) =>
					prevProducts.map((product) =>
						product.id === productId
							? { ...product, isFavorited: isFavorited }
							: product
					)
				);

				showCustomToast('add', '', prevIsliked ? '已取消收藏！' : '已加入收藏！');
			} catch (error) {
				console.error('Error toggling favorite:', error);
				showCustomToast('', '', prevIsliked ? '取消收藏失敗！' : '加入收藏失敗！');
			}
		} else {
			showCustomToast('', '', '登入後才可以收藏喔！');
		}
	};

	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 12; // 每頁顯示的卡片數量
	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentPageProducts = products.slice(startIndex, endIndex);

	// 計算總頁數
	const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

	// 篩選功能
	const [filterCriteria, setFilterCriteria] = useState({
		search: '',
		class: null,
		order: '',
		priceRange: [0, 5000],
		isOnSale: false,
		shopId: null,
		shopName: '',
		shopLogo: '',
	});

	// 若更新完filterCriteria後需要立即執行fetchProducts()可用
	const [triggerFetch, setTriggerFetch] = useState(false);
	useEffect(() => {
		if (triggerFetch) {
			console.log('triggerFetch', triggerFetch);
			fetchProducts(); // 執行 fetchProducts
			setTriggerFetch(false); // 重置標誌
		}
	}, [triggerFetch, filterCriteria]);

	// 商家篩選
	const handleShopClick = (id, name, logoName) => {
		setFilterCriteria((prevCriteria) => ({
			...prevCriteria,
			shopId: id,
			shopName: name,
			shopLogo: logoName,
		}));
		setTriggerFetch(true);
	};

	console.log('filterCriteria:', filterCriteria);
	return (
		<>
			<Header />
			<div className={`${Styles['banner']}`}>
				<Filter
					filterCriteria={filterCriteria}
					setFilterCriteria={setFilterCriteria}
					fetchProducts={fetchProducts}
					setTriggerFetch={setTriggerFetch}
				/>
				<IconClassFilter
					styles={{ marginTop: '15px' }}
					setFilterCriteria={setFilterCriteria}
					setTriggerFetch={setTriggerFetch}
				/>
				<Tags
					setFilterCriteria={setFilterCriteria}
					setTriggerFetch={setTriggerFetch}
					filterCriteria={filterCriteria}
				/>
			</div>
			<div className={`${Styles['section-product-list']}`}>
				<div className={`${Styles['container_1440']}`}>
					<div className={`${Styles['sidebar-container']}`}>
						<ShopSidebar
							styles={{
								maxHeight: '100%',
								position: 'absolute',
								top: '0',
								left: '0',
							}}
							onShopClick={handleShopClick}
						/>
					</div>
					<div className={`${Styles['product-list']} container-fluid py-auto`}>
						{filterCriteria.shopId ? (
							<div
								className={`${Styles['selected-shop']} p-lg-2 ms-lg-3 mb-5 d-flex align-items-center justify-content-center justify-content-lg-start gap-5`}
							>
								<div className={`${Styles['selected-shop-logo-container']}`}>
									<Image
										className={`${Styles['selected-shop-logo']}`}
										src={`/photos/shop_logo/${filterCriteria.shopLogo}`}
										fill
										alt=""
									/>
								</div>
								<h3 className="m-0">{filterCriteria.shopName}</h3>
							</div>
						) : (
							''
						)}

						<div
							className={`${Styles['product-list-row']} row row-cols-xl-3 row-cols-lg-2 row-cols-md-1 row-cols-2 g-0 w-100`}
							style={
								products.length > 2
									? {
											justifyContent: 'start',
									  }
									: { justifyContent: 'center' }
							}
						>
							{products.length == 0 && (
								<>
									<div className={`${Styles['product-list-notFoundText']}`}>
										<h2 className="my-auto text-center text-secondary fw-light">
											Oops...沒有找到商品
											<br />
											要不要換個店家或篩選條件試試?
										</h2>
									</div>
								</>
							)}
							{currentPageProducts.map((product) => (
								<Link
									key={product.id}
									className={`${Styles['product-card-container']} col mb-5 px-0 d-flex justify-content-center`}
									href={`/product/${product.id}`}
									style={{ cursor: 'pointer' }}
								>
									<Card
										userId={user ? user.id : null}
										productID={product.id}
										price={product.price}
										name={product.name}
										photo={product.file_name}
										userLike={product.isFavorited}
										toggleFavorite={toggleFavorite}
										{...(product.discount >= 0 && product.discount < 1
											? {
													onSalePrice: Math.ceil(
														product.price * product.discount
													),
											  }
											: product.discount < 0
											? {
													onSalePrice: Math.ceil(
														product.price + parseInt(product.discount)
													),
											  }
											: {})}
									/>
								</Link>
							))}
						</div>
						<div className={`mt-3`}>
							{products.length > ITEMS_PER_PAGE && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={(page) => setCurrentPage(page)}
									changeColor="#fe6f67"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={`${Styles['section-bigImage']}`}>
				<Image
					src={'/photos/background/bg-productListSec2.png'}
					fill
					alt="It supposed to be a cake :p"
				/>
			</div>
			<div className={`${Styles['section-featuredShops']}`}>
				<h2 className={Styles['color-primary']}>精選商家</h2>
				<div className={`${Styles['shops']} container`}>
					<div className={`row row-cols-3 row-cols-lg-4`}>
						{featuredShops.map((fShop) => (
							<div className={`col px-0 ZRT-center`} key={fShop.id}>
								<Link
									href={`/shop/${fShop.id}`}
									className={`${Styles['shop-container']} ZRT-click`}
								>
									<Image
										className={`${Styles['shop-logo']}`}
										src={`/photos/shop_logo/${fShop.logo_path}`}
										alt=""
										fill
									/>
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
			<Footer bgColor="" />
		</>
	);
}
