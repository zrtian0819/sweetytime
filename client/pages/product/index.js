import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/productList.module.scss';
import Card from '@/components/product/productCard';
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
					<ShopSidebar className={`${Styles['sidebar']}`} />
					<div className={`${Styles['product-list']}`}>
						<div className={`row row-cols-xl-3 row-cols-lg-2 row-cols-1 g-0`}>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
							<div className={`col px-0 d-flex justify-content-center`}>
								<Card />
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer bgColor="" />
		</>
	);
}
