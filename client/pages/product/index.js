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
import { useRouter } from 'next/router';

export default function Product() {
	const router = useRouter();
	const [products, setProducts] = useState([]);
	const [featuredShops, setFeaturedShops] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/product')
			.then((response) => setProducts(response.data))
			.catch((error) => console.error('Error fetching products:', error));

		axios
			.get('http://localhost:3005/api/product-featureShops')
			.then((response) => setFeaturedShops(response.data))
			.catch((error) => console.error('Error fetching shops:', error));
	}, []);

	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 12; // 每頁顯示的卡片數量
	// 計算當前頁顯示的卡片範圍
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentPageProducts = products.slice(startIndex, endIndex);

	// 計算總頁數
	const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

	return (
		<>
			<Header />
			<div className={`${Styles['banner']}`}>
				<Filter />
				<IconClassFilter styles={{ marginTop: '15px' }} />
				<Tags />
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
						/>
					</div>
					<div className={`${Styles['product-list']}`}>
						<div
							className={`row row-cols-xl-3 row-cols-lg-2 row-cols-md-1 row-cols-2 g-0`}
						>
							{currentPageProducts.map((product) => (
								<div
									key={product.id}
									className={`${Styles['product-card-container']} col mb-5 px-0 d-flex justify-content-center`}
									onClick={() => router.push(`/product/${product.id}`)}
									style={{ cursor: 'pointer' }}
								>
									<Card
										productID={product.id}
										price={product.price}
										name={product.name}
										photo={product.file_name}
									/>
								</div>
							))}
						</div>
						<div className={`mt-3`}>
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
