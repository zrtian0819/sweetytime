import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/productDetail.module.scss';
import Image from 'next/image';

import { IoMdShare } from 'react-icons/io';
import LikeButton from '@/components/product/likeButton';
import { BiSolidCartAdd } from 'react-icons/bi';
import { FaCartPlus } from 'react-icons/fa';

export default function ProductDetail(props) {
	return (
		<>
			<Header />
			<div className={`${Styles['section-product']} test-mode`}>
				<div className={`${Styles['product-container']}`}>
					<div className={`${Styles['product-photo']}`}>
						<div className={`${Styles['photo-container']}`}>
							<Image
								className={`${Styles['photo']}`}
								src={'/photos/products/GustaveHenri_18.jpg'}
								fill
							/>
						</div>
					</div>
					<div className={`${Styles['product-info']}`}>
						<h2 className={`${Styles['product-name']}`}>皇家檸檬甜塔</h2>
						<h3 className={`${Styles['product-description']}`}>
							檸檬甜塔的升級選擇，古斯塔亨利採用法國直輸頂級諾曼地發酵奶油，臺灣當地檸檬，新鮮製作。
						</h3>
						<div className={`${Styles['product-types']}`}>
							<h3 className={`${Styles['product-class']}`}>塔</h3>
							<div className={`${Styles['product-tags']}`}>
								<h3 className={`${Styles['tag']}`}>#檸檬</h3>
								<h3 className={`${Styles['tag']}`}>#甜塔</h3>
							</div>
						</div>
						<div className={`${Styles['product-others']}`}>
							<h3 className={`${Styles['stockAmount']}`}>剩餘5件</h3>
							<LikeButton
								originalLiked={true}
								size={'32px'}
								className={`${Styles['likeBtn']}`}
							/>
							<IoMdShare className={`${Styles['shareBtn']}`} />
						</div>
						<div className={`${Styles['product-buy']}`}>
							<h2 className={`${Styles['price']}`}>NT 350</h2>
							<div>+ 1 -</div>
							<button className={`${Styles['addToCart']}`}>
								加入購物車
								<BiSolidCartAdd style={{ fontSize: 30 }} />
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
