import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Title from '@/components/product/title';
import Styles from '@/styles/productDetail.module.scss';

export default function Product() {
	return (
		<>
			<Header />
				<div className={`${Styles['product']} ZRT-center`}>

				</div>
				<div className={`${Styles['introduction']}`}>
					<Title />
                </div>
			<Footer />
		</>
	);
}
