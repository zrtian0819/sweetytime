import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/productDetail.module.scss';

export default function Lesson() {
	return (
		<>
			<Header />
				<div className={Styles['product']}></div>
			<Footer />
		</>
	);
}
