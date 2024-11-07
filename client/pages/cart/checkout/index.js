import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import Link from 'next/link';
import CheckoutItem from '@/components/cart/checkout-item';
import { useCart } from '@/context/cartContext';
import { useUser } from '@/context/userContext';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Checkout(props) {
	//這裡要改成購物車傳入的物件
	const [checkPay, setCheckPay] = useState([]);
	const [showShip, setShowShip] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [shipingWay, setShipingWay] = useState([]);
	const [payWay, setPayWay] = useState('');

	const router = useRouter();
	const { user } = useUser();

	let user_id;
	useEffect(() => {
		if (user) {
			console.log('結帳畫面的判斷:目前的登入者user id:', user.id);
			user_id = user.id;
		} else {
			console.log('結帳畫面的判斷:目前是登出狀態');
			router.push({
				pathname: '/login',
				query: { returnUrl: router.asPath },
			}); //發現是登出狀態直接導頁到login
		}
	}, []);

	useEffect(() => {
		//從資料庫取得地址

		//取得地址資訊
		const initCheck = async () => {
			try {
				const addressRes = await axios.get(
					`http://localhost:3005/api/cart/address/${user_id}`
				);
				let userAddressAry = addressRes.data;

				const shipingRes = await axios.get(`http://localhost:3005/api/cart/delivery`);
				setShipingWay(shipingRes.data);

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
		console.log('checkPay is changed:', checkPay);

		//計算商品總價格
		let price = 0;
		checkPay.forEach((shop) => {
			shop.cart_content.forEach((pd) => {
				price += pd.price * pd.discount * pd.quantity;
			});
		});
		setTotalPrice(price);
	}, [checkPay]);

	useEffect(() => {
		console.log('付款方式', payWay);
	}, [payWay]);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']}`}>
				<div className="container-fluid d-flex justify-content-start align-items-center flex-column">
					<StepBar />

					<div className="d-flex flex-column w-100 mt-4">
						{checkPay && checkPay.length > 0 && shipingWay.length != 0 ? (
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
												<select
													className="form form-control"
													required
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
																		way: newData,
																	};
																}
																return store;
															}
														);

														setCheckPay(nextCheckPay);
													}}
												>
													<option value="" selected disabled>
														選擇寄送方式
													</option>
													{shipingWay.map((shipWay) => {
														return (
															<option
																key={shipWay.id}
																value={shipWay.id}
															>
																{shipWay.class_name}
															</option>
														);
													})}
												</select>

												<br />
												<h3 className="fw-bold">寄件資訊</h3>
												<h4 className="name">
													收件人姓名<span className="text-danger">*</span>
													：
												</h4>
												<input
													type="text"
													className="form form-control mb-2"
													value={checkPay[i].name}
													required
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
												<h4 className="phone">
													收件人電話<span className="text-danger">*</span>
													：
												</h4>
												<input
													type="phone"
													className="form form-control mb-2"
													value={checkPay[i].phone}
													required
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
												<h4 className="phone">
													收件地址<span className="text-danger">*</span>：
												</h4>
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
											<input
												type="radio"
												name="pay"
												value="creditCard"
												className="me-2"
												selected={payWay == 'creditCard'}
												onChange={() => {
													setPayWay('creditCard');
												}}
											/>
											信用卡
										</label>
										<label className="d-block mb-1">
											<input
												type="radio"
												name="pay"
												value="linePay"
												className="me-2"
												selected={payWay == 'linePay'}
												onChange={() => {
													setPayWay('linePay');
												}}
											/>
											LINE PAY
										</label>
										<label className="d-block mb-1">
											<input
												type="radio"
												name="pay"
												value="ecPay"
												className="me-2"
												selected={payWay == 'ecPay'}
												onChange={() => {
													setPayWay('ecPay');
												}}
											/>
											綠界科技
										</label>
										<label className="d-block mb-1">
											<input
												type="radio"
												name="pay"
												value="bluePay"
												className="me-2"
												selected={payWay == 'bluePay'}
												onChange={() => {
													setPayWay('bluePay');
												}}
											/>
											藍新科技
										</label>
									</div>
									<div className="col-12 col-lg-4 p-4">
										<h3 className="text-danger">商品總計 NT$ {totalPrice}</h3>
										<h3>運費總計 NT$ 120</h3>
										{/* <h3>優惠折扣 NT$ -20</h3> */}
										<br />
										<h2 className="fw-bolder">
											總金額 NT${' '}
											<span className="text-danger">{totalPrice + 120}</span>
										</h2>
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
