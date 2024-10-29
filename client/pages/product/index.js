import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/productList.module.scss';
import Card from '@/components/product-card';
import Filter from '@/components/filter-box';
import IconClassFilter from '@/components/iconClassFilter';
import Tags from '@/components/lesson/tag';
import ShopSidebar from '@/components/shopSidebar';

export default function Product() {
	return (
		<>
			<Header />
			<div className={`${Styles['banner']}`}>
				<Filter />
				<IconClassFilter />
				<Tags />
			</div>
			<div className={`${Styles['section-product-list']}`}>
				<div className={`${Styles['container_1440']}`}>
					<ShopSidebar />
					<div className={Styles['product-list']}></div>
				</div>
			</div>
			<Footer bgColor="" />
		</>
	);
}
