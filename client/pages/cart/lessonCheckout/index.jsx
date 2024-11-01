import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import Link from 'next/link';
import CheckoutItem from '@/components/cart/checkout-item';

export default function LessonCheckout(props) {
	useEffect(() => {
		//取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
	}, []);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']}`}>
				<h2 className={`${Styles['ZRT-pageTitle']} col mb-4 text-center`}>課程報名</h2>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					<div className="d-flex flex-column w-100 mt-4">
						<div className={`${Styles['ZRT-checkoutArea']} container px-3`}>
							<div className="row">
								<div className="col-12  d-flex flex-column">
									<CheckoutItem
										type="lesson"
										src="/photos/lesson/00_cake_chestnut.jpg"
										name="蒙布朗栗子巧克力蛋糕"
										price={2500}
									/>

									<hr />
									<div className="d-flex justify-content-end mb-2 pe-2 text-danger">
										<h3>小計 NT${'2,500'}</h3>
									</div>
								</div>
							</div>
						</div>

						<div className="container">
							<div className="row">
								<div className="col-12 col-lg-8 p-4">
									<h3 className="fw-bold">付款方式</h3>
									<label className="d-block mb-1">
										<input type="radio" name="pay" className="me-2" />
										信用卡
									</label>
									<label className="d-block mb-1">
										<input type="radio" name="pay" className="me-2" />
										LINE PAY
									</label>
									<label className="d-block mb-1">
										<input type="radio" name="pay" className="me-2" />
										綠界科技
									</label>
									<label className="d-block mb-1">
										<input type="radio" name="pay" className="me-2" />
										藍新科技
									</label>
								</div>
								<div className="col-12 col-lg-4 p-4">
									<div className="fw-bolder">
										總金額 NT$ <span className="text-danger">{'2,500'}</span>
									</div>
									<Link
										className="ZRT-btn btn-lpnk w-100 mt-3 d-flex justify-content-center align-items-center ZRT-click"
										href="/cart/checkoutDone"
									>
										確認報名
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
