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

export default function Product() {
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
							{products.map((product) => (
								<div
									key={product.id} // 使用唯一的 key
									className={`col mb-5 px-0 d-flex justify-content-center`}
								>
									<Card
										price={product.price}
										name={product.name}
										photo={product.file_name}
									/>
								</div>
							))}
						</div>
						<div className={`mt-3`}>
							<Pagination currentPage={1} changeColor="#fe6f67" />
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
								<div className={`${Styles['shop-container']} ZRT-click`}>
									<Image
										className={`${Styles['shop-logo']}`}
										src={`/photos/shop_logo/${fShop.logo_path}`}
										fill
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<Footer bgColor="" />
		</>
	);
}
