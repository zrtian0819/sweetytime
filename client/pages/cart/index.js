import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import CartItem from '@/components/cart/cart-item';
import Link from 'next/link';

export default function Cart(props) {
	useEffect(() => {
		//取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
	}, []);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']} `}>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					<StepBar />

					<div className="d-flex flex-column w-100 mt-4">
						<label>
							<input type="checkbox" />
							選擇全部
						</label>

						<div className={Styles['ZRT-cartArea']}>
							<label className={Styles['ZRT-shopName']}>
								<input type="checkbox" />
								<h4>Chizup!</h4>
							</label>

							<CartItem />
							<CartItem />
							<CartItem />
						</div>
						<div className={Styles['ZRT-cartArea']}>
							<label className={Styles['ZRT-shopName']}>
								<input type="checkbox" />
								<h4>Chizdown!</h4>
							</label>

							<CartItem />
						</div>

						<div
							className={`${Styles['ZRT-total']} d-flex justify-content-between align-items-center`}
						>
							<span>已選擇{3}件商品</span>
							<span>
								<span className="me-4">總計 NT${5000}</span>
								<Link className="ZRT-btn btn-lpnk ZRT-click" href="/cart/checkout">
									前往結帳
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
