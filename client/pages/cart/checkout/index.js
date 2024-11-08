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
import Swal from 'sweetalert2';
import DeliveryModal from '@/components/delivery-modal';

export default function Checkout(props) {
	//這裡要改成購物車傳入的物件
	const [checkPay, setCheckPay] = useState([]);
	const [showShip, setShowShip] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [shipingWay, setShipingWay] = useState([]);

	const [allShipAry, setAllShipAry] = useState('');
	const [CurrentShipId, setCurrentShipId] = useState(null); //傳入id以確定當前選擇的商家
	const [currentShip, setCurrentShip] = useState({}); //從選擇工具裡面選擇的項目會被設定進去

	const [couponAry, setCouponAry] = useState([]);

	const [payWay, setPayWay] = useState('');
	const router = useRouter();
	const { user } = useUser();

	const handlePay = async () => {
		try {
			// 驗證每個商店的運送資訊
			const validateShopInfo = (shop) => {
				const requiredFields = [
					{ field: 'way', message: '配送方式' },
					{ field: 'name', message: '收件人姓名' },
					{ field: 'phone', message: '聯絡電話' },
					{ field: 'address', message: '收件地址' },
				];

				for (const { field, message } of requiredFields) {
					if (!shop[field] || shop[field].trim() === '') {
						throw new Error(`${shop.shop_name} 請填寫${message}`);
					}
				}

				// 額外驗證電話格式（如果需要的話）
				const phonePattern = /^09\d{8}$/; // 台灣手機號碼格式
				if (!phonePattern.test(shop.phone)) {
					throw new Error(`${shop.shop_name} 的聯絡電話格式不正確`);
				}
			};

			// 檢查購物車是否為空
			if (!checkPay || checkPay.length === 0) {
				await Swal.fire({
					title: '購物車是空的',
					icon: 'warning',
				});
				return;
			}

			// 驗證每個商店的資料
			for (const shop of checkPay) {
				validateShopInfo(shop);
			}

			// 驗證支付方式
			if (!payWay) {
				await Swal.fire({
					title: '請選擇支付方式',
					icon: 'warning',
				});
				return;
			}

			// 處理不同的支付方式
			const paymentMethods = {
				creditCard: async () => {
					try {
						console.log('信用卡支付流程');
						// await processCreditCardPayment()
						router.push('/cart/payment-complete');
					} catch (error) {
						console.error('信用卡支付失敗:', error);
						throw new Error('信用卡支付失敗');
					}
				},

				ecPay: async () => {
					try {
						const url = new URL('http://localhost:3005/api/ecpay-test-only');
						url.searchParams.append('amount', totalPrice);
						window.location.href = url.toString();
					} catch (error) {
						console.error('綠界支付導向失敗:', error);
						toast.error('支付導向失敗，請稍後再試');
						throw new Error('綠界支付導向失敗');
					}
				},

				linePay: async () => {
					console.log('使用linePay結帳時');
					router.push('/cart/checkoutDone');
				},
			};

			// 執行選擇的支付方式
			const selectedPaymentMethod = paymentMethods[payWay];
			if (!selectedPaymentMethod) {
				throw new Error(`不支援的支付方式: ${payWay}`);
			}

			await selectedPaymentMethod();
		} catch (error) {
			console.error('支付過程發生錯誤:', error);
			await Swal.fire({
				title: '無法進行結帳',
				text: error.message,
				icon: 'error',
			});
		}
	};

	//處理7-11門市的選取
	const handleShipment = async () => {
		console.log('處理超商的選取,❌未完成');
		return;
		try {
			await axios.post('http://localhost:3005/api/shipment/711');
		} catch (err) {
			console.log('選取超商時發生錯誤:' + err);
		}
	};

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

	let shipInfo;
	useEffect(() => {
		//從資料庫取得地址

		//取得地址資訊
		const initCheck = async () => {
			try {
				const addressRes = await axios.get(
					`http://localhost:3005/api/cart/address/${user_id}`
				);
				let userAddressAry = addressRes.data;
				setAllShipAry(userAddressAry);

				const shipingRes = await axios.get(`http://localhost:3005/api/cart/delivery`);
				setShipingWay(shipingRes.data);

				const userCouponAry = await axios.get(
					`http://localhost:3005/api/cart/user-coupon/${user_id}`
				);
				
				//篩除不能使用的優惠券
				const availableCoupon = userCouponAry.data.forEach((cp) => {
					console.log(cp);
				});
				setCouponAry(userCouponAry.data);

				//依照地址取得的結果判定要放什麼ship資訊到商家
				if (userAddressAry.length != 0) {
					const defaultAddress = userAddressAry.find(
						(address) => address.defaultAdd != 0
					);
					// console.log('defaultAddress:', defaultAddress);
					shipInfo = defaultAddress
						? {
								way: '',
								name: defaultAddress.name,
								phone: defaultAddress.phone,
								address: defaultAddress.address,
								note: '',
						  }
						: {
								way: '',
								name: '',
								phone: '',
								address: '',
								note: '',
						  };
				} else {
					shipInfo = {
						way: '',
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
		console.log('currentShip:', currentShip);
		// 避免 currentShip 為空值時的處理
		if (!currentShip) {
			console.log('沒有選擇常用地址');
			return;
		}

		// 確保必要的資料都存在
		if (!currentShip.name || !currentShip.phone || !currentShip.address) {
			console.warn('常用地址資料不完整', currentShip);
			return;
		}

		// 確保 CurrentShipId 有效
		if (!CurrentShipId) {
			console.warn('沒有指定要更新的商店 ID');
			return;
		}

		const nextCheckPay = checkPay.map((shop) => {
			if (shop.shop_id === CurrentShipId) {
				// 使用嚴格相等
				return {
					...shop,
					name: currentShip.name.trim(),
					phone: currentShip.phone.trim(),
					address: currentShip.address.trim(),
					way: '2',
				};
			}
			return shop; // 簡化不需要展開的情況
		});

		setCheckPay(nextCheckPay);
	}, [currentShip, CurrentShipId]);

	useEffect(() => {
		console.log('付款方式', payWay);
	}, [payWay]);

	return (
		<>
			<Header />
			{showShip && (
				<DeliveryModal
					deliveryAry={allShipAry}
					setShowShip={setShowShip}
					setCurrentShipId={setCurrentShipId}
					setCurrentShip={setCurrentShip}
				/>
			)}

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

												<div className="border border-bottom my-3"></div>
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
													value={shop.way}
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
												{checkPay[i].way == '1' && (
													<div className="editShipInfo d-flex justify-content-end mt-3">
														<div
															className="ZRT-btn btn-lpnk ZRT-click rounded-pill"
															onClick={() => {
																handleShipment();
															}}
														>
															選擇超商門市
														</div>
													</div>
												)}

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
													className={`form form-control mb-2 ${
														checkPay[i].way == '1'
															? 'text-secondary'
															: ''
													}`}
													readOnly={checkPay[i].way == '1'}
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
													<div
														className="ZRT-btn btn-lpnk ZRT-click rounded-pill"
														onClick={() => {
															setShowShip(true);
															setCurrentShipId(shop.shop_id);
														}}
													>
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

										<div
											className="ZRT-btn btn-lpnk w-100 mt-3 d-flex justify-content-center align-items-center ZRT-click"
											// href="/cart/checkoutDone"
											onClick={() => {
												handlePay();
											}}
										>
											確認付款
										</div>
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
