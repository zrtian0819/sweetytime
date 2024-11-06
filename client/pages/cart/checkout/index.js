import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import Link from 'next/link';
import CheckoutItem from '@/components/cart/checkout-item';
import { useCart } from '@/context/cartContext';
import axios from 'axios';

export default function Checkout(props) {
	//這裡要改成購物車傳入的物件
	const [checkPay, setCheckPay] = useState([]);
	const [showShip, setShowShip] = useState(false);
	const user_id = 2; //💡暫時的資料之後要從userContext取出

	useEffect(() => {
		//從資料庫取得地址

		//取得地址資訊
		const initCheck = async () => {
			try {
				const res = await axios.get(`http://localhost:3005/api/cart/address/${user_id}`);
				let userAddressAry = res.data;

				//依照地址取得的結果判定要放什麼ship資訊到商家
				let shipInfo;
				if (userAddressAry.length != 0) {
					const defaultAddress = userAddressAry.find(
						(address) => address.defaultAdd != 0
					);
					console.log('defaultAddress:', defaultAddress);
					shipInfo = defaultAddress
						? {
								way: 1,
								name: defaultAddress.name,
								phone: defaultAddress.phone,
								address: defaultAddress.address,
								note: '',
						  }
						: {
								way: 1,
								name: '',
								phone: '',
								address: '',
								note: '',
						  };
				} else {
					shipInfo = {
						way: 1,
						name: '',
						phone: '',
						address: '',
						note: '',
					};
				}

				//取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
				let localCart = JSON.parse(localStorage.getItem('cart'));

				let myCart = localCart.find((user) => user.user_id == user_id); //篩掉其他用戶
				myCart.user_cart.forEach((shop) => {
					shop.cart_content = shop.cart_content.filter((pd) => pd.selected); //篩除未被選取的產品
				});
				myCart.user_cart = myCart.user_cart.filter((shop) => shop.cart_content.length != 0); //篩除空殼店家

				myCart.user_cart = myCart.user_cart.map((shop) => {
					return {
						...shop,
						...shipInfo,
					};
				}); //將運輸資運匯入至每個商家物件內

				console.log('異步中的myCart.user_cart:', myCart.user_cart);
				setCheckPay(myCart.user_cart);
			} catch (e) {
				console.error('❌初始化購物車時發生錯誤:', e);
			}
		};

		initCheck();
	}, []);

	useEffect(() => {
		// console.log('checkPay is changed:', checkPay);
	}, [checkPay]);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']}`}>
				<div className="container-fluid d-flex justify-content-start align-items-center flex-column">
					<StepBar />

					<div className="d-flex flex-column w-100 mt-4">
						{checkPay && checkPay.length > 0 ? (
							checkPay.map((shop, i) => {
								// 計算店家商品小計
								const shopTotal = shop.cart_content.reduce((sum, pd) => {
									return sum + pd.price * pd.quantity;
								}, 0);

								return (
									<div
										className={`${Styles['ZRT-checkoutArea']} container px-3`}
										key={shop.shop_id}
									>
										<div className="row">
											<div className="col mb-2">{shop.shop_name}</div>
										</div>

										<div className="row">
											<div className="col-12 col-lg-7 d-flex flex-column">
												<div
													className={`${Styles['ZRT-tHead']} container-fluid mb-2`}
												>
													<div className="row">
														<div className="col-3">圖示</div>
														<div className="col-5">商品名稱</div>
														<div className="col ">價格</div>
														<div className="col ">件數</div>
													</div>
												</div>
												{shop.cart_content.map((pd) => (
													<CheckoutItem
														key={pd.product_id}
														type="product"
														src={`/photos/products/${pd.photo_name}`}
														name={pd.name}
														price={pd.price}
														count={pd.quantity}
													/>
												))}

												<hr />
												<div className="d-flex justify-content-end mb-2">
													小計<del>NT${shopTotal.toLocaleString()}</del>
												</div>
												<div className="d-flex justify-content-between">
													<span>
														已使用的優惠:{' '}
														{shop.discount || '未使用優惠'}
													</span>
													<span>
														折扣後金額 NT$
														{(
															shopTotal * (shop.discount || 1)
														).toLocaleString()}
													</span>
												</div>
											</div>
											<div className="col-12 col-lg-5 mt-3 mt-lg-0 py-4">
												<h3 className="fw-bold">運送方式</h3>
												<select name="" id="" className="form form-control">
													<option value="1">7-11 超商取貨</option>
												</select>

												<br />
												<h3 className="fw-bold">寄件資訊</h3>
												<h4 className="name">收件人：</h4>
												<input
													type="text"
													className="form form-control mb-2"
													value={checkPay[i].name}
													onChange={(e) => {
														const newData = e.target.value;
														// 創建新的陣列，保持不可變性
														const nextCheckPay = checkPay.map(
															(store) => {
																if (
																	store.shop_id === shop.shop_id
																) {
																	return {
																		...store, // 展開運算符創建新物件
																		name: newData,
																	};
																}
																return store;
															}
														);

														setCheckPay(nextCheckPay);
													}}
												/>
												<h4 className="phone">收件人電話：</h4>
												<input
													type="text"
													className="form form-control mb-2"
													value={checkPay[i].phone}
													onChange={(e) => {
														const newData = e.target.value;
														// 創建新的陣列，保持不可變性
														const nextCheckPay = checkPay.map(
															(store) => {
																if (
																	store.shop_id === shop.shop_id
																) {
																	return {
																		...store, // 展開運算符創建新物件
																		phone: newData,
																	};
																}
																return store;
															}
														);

														setCheckPay(nextCheckPay);
													}}
												/>
												<h4 className="phone">收件地址：</h4>
												<textarea
													type="text"
													className="form form-control mb-2"
													value={checkPay[i].address}
													onChange={(e) => {
														const newData = e.target.value;
														// 創建新的陣列，保持不可變性
														const nextCheckPay = checkPay.map(
															(store) => {
																if (
																	store.shop_id === shop.shop_id
																) {
																	return {
																		...store, // 展開運算符創建新物件
																		address: newData,
																	};
																}
																return store;
															}
														);

														setCheckPay(nextCheckPay);
													}}
												/>
												<br />
												<div className="editShipInfo d-flex justify-content-end">
													<div className="ZRT-btn btn-lpnk ZRT-click">
														選擇其他常用寄件資訊
													</div>
												</div>

												<br />
												<h3 className="fw-bold">備註</h3>
												<textarea
													name=""
													id=""
													className="form form-control"
													value={checkPay[i].note}
													onChange={(e) => {
														const newData = e.target.value;
														// 創建新的陣列，保持不可變性
														const nextCheckPay = checkPay.map(
															(store) => {
																if (
																	store.shop_id === shop.shop_id
																) {
																	return {
																		...store, // 展開運算符創建新物件
																		note: newData,
																	};
																}
																return store;
															}
														);

														setCheckPay(nextCheckPay);
													}}
												/>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<h2 className="text-center py-5">請重新到購物車提交</h2>
						)}

						{checkPay && checkPay.length > 0 ? (
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
						) : (
							''
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
