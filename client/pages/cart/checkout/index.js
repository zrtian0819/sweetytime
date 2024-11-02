import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import Link from 'next/link';
import CheckoutItem from '@/components/cart/checkout-item';

export default function Checkout(props) {
	useEffect(() => {
		//取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
	}, []);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']}`}>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					<StepBar />

					<div className="d-flex flex-column w-100 mt-4">
						<div className={`${Styles['ZRT-checkoutArea']} container px-3`}>
							<div className="row">
								<div className="col-1 mb-2">ChizUp!</div>
							</div>

							<div className="row">
								<div className="col-12 col-lg-7 d-flex flex-column">
									<CheckoutItem
										type="product"
										src="/photos/products/20_cupostory_tart_choco.jpg"
										name="厲害的巧克力蛋糕"
										price={520}
										count={2}
									/>
									<CheckoutItem
										type="product"
										src="/photos/products/20_cupostory_tart_choco.jpg"
										name="厲害的巧克力蛋糕厲害的巧克力蛋糕厲害的巧克力蛋糕"
										price={520}
										count={2}
									/>
									<CheckoutItem
										type="product"
										src="/photos/products/20_cupostory_tart_choco.jpg"
										name="厲害的巧克力蛋糕"
										price={520}
										count={2}
									/>
									<hr />
									<div className="d-flex justify-content-end mb-2">
										小計<del>NT${'12,000'}</del>
									</div>
									<div className="d-flex justify-content-between">
										<span>已使用的優惠: {'???'}</span>
										<span>折扣後金額 NT${'11,999'}</span>
									</div>
								</div>
								<div className="col-12 col-lg-5 mt-3 mt-lg-0 py-4">
									<h3 className="fw-bold">運送方式</h3>
									<select name="" id="" className="form form-control">
										<option value="1">7-11 超商取貨</option>
									</select>

									<br />
									<h3 className="fw-bold">收件資訊</h3>
									<h4 className="name" contentEditable>
										王曉明
									</h4>
									<h4 className="phone" contentEditable>
										0912341234
									</h4>
									<h4 className="phone" contentEditable>
										(速達門市) 320桃園市中壢區新生路二段378之2號
									</h4>
									<br />
									<a className="editShipInfo d-flex justify-content-end">
										編輯送貨資訊
									</a>

									<br />
									<h3 className="fw-bold">備註</h3>
									<textarea
										name=""
										id=""
										className="form form-control"
										value="不要香菜"
									/>
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
									<h4>商品總計 NT$ 2144</h4>
									<h4>運費總計 NT$ 120</h4>
									<h4>優惠折扣 NT$ -20</h4>
									<br />
									<div className="fw-bolder">
										總金額 NT$ <span className="text-danger">{2244}</span>
									</div>
									<Link
										className="ZRT-btn btn-lpnk w-100 mt-3 d-flex justify-content-center align-items-center ZRT-click"
										href="/cart/checkoutDone"
									>
										確認付款
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
