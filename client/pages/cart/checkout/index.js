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
import { useShip711StoreOpener } from '@/hooks/use-ship-711-store';

export default function Checkout(props) {
	//這裡要改成購物車傳入的物件
	const [checkPay, setCheckPay] = useState([]);
	const [showShip, setShowShip] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [priceCount, setPriceCount] = useState({
		originPrice: null,
		shipPrice: null,
		CouponDiscount: null,
		finalPrice: null,
	});
	const [shipingWay, setShipingWay] = useState([]);

	const [allShipAry, setAllShipAry] = useState('');
	const [CurrentShipId, setCurrentShipId] = useState(null); //傳入id以確定當前選擇的商家
	const [currentShip, setCurrentShip] = useState({}); //從選擇工具裡面選擇的項目會被設定進去
	const [processingShopId, setProcessingShopId] = useState(null);

	const [couponAry, setCouponAry] = useState([]);

	const [payWay, setPayWay] = useState('');
	const router = useRouter();
	const { user } = useUser();
	const { cart, handleCart } = useCart();

	//引入7-11門市功能
	const { store711, openWindow, closeWindow } = useShip711StoreOpener(
		'http://localhost:3005/api/shipment/711',
		{ autoCloseMins: 5, enableLocalStorage: true, keyLocalStorage: 'store711' }
	);

	const createOrder = async () => {
		//建立訂單
		try {
			const response = await axios.post(
				'http://localhost:3005/api/cart/create-order',
				checkPay,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.status === 201) {
				console.log('資料新增成功:', response.data);
				handleCart(cart, '_', 'afterBuyClear'); //將購物車清空
				return response.data;
			}
		} catch (error) {
			if (error.response) {
				// 伺服器回應的錯誤
				console.error('伺服器錯誤:', error.response.data);
				console.error('狀態碼:', error.response.status);
			} else if (error.request) {
				// 請求發送失敗
				console.error('請求錯誤:', error.request);
			} else {
				// 其他錯誤
				console.error('錯誤:', error.message);
			}
			throw error;
		}
	};

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
						url.searchParams.append('amount', priceCount.finalPrice);
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

			await createOrder();
			await selectedPaymentMethod();

			//處理訂單
		} catch (error) {
			console.error('支付過程發生錯誤:', error);
			await Swal.fire({
				title: '無法進行結帳',
				text: error.message,
				icon: 'error',
			});
		}
	};

	//🔧處理7-11門市的選取
	const handleShipment = async (sid) => {
		setProcessingShopId(sid);
		openWindow();
	};

	//🔧處理優惠券被改變時執行的動作
	const handleSelectCoupon = (sid, cid) => {
		//sid:shop_id ; cid:coupon_id
		console.log('handleSelectCoupon:', '商家id:' + sid, '使用了優惠券id:' + cid);
		let nextCouponAry = [...couponAry];
		let nextCheckPay = [...checkPay];
		let showMsg = false;

		try {
			//先將原本此shop選取的項目從coupon中洗掉
			nextCouponAry = nextCouponAry.map((cp) => {
				if (cp.selected_shop_id == sid) {
					return {
						...cp,
						selected_shop_id: null,
					};
				}
				return cp;
			});

			if (!cid || cid == '') {
				nextCheckPay = nextCheckPay.map((shop) => {
					if (shop.shop_id == sid) {
						return {
							...shop,
							coupon_id: null,
							discount_rate: null,
							type: null,
							maximumDiscount: null,
							minimumSpend: null,
							afterDiscount: null,
							discountMsg: '沒有選取任何折扣',
						};
					}
					return shop;
				});
				throw new Error('改成沒有傳入coupon_id');
			}

			//判定優惠券是否被選去過
			let CurrentCpIsSelected = false;
			nextCouponAry.forEach((cp) => {
				// 優惠券已被占用
				if (cp.coupon_id == cid && cp.selected_shop_id != null) {
					CurrentCpIsSelected = true; //優惠券已被占用
					return;
				}
			});
			if (CurrentCpIsSelected) {
				showMsg = true;
				throw new Error('優惠券已被其它商家選取了');
			}

			//將優惠券編號寫入結帳物件中
			if (!CurrentCpIsSelected) {
				// 從優惠券中取出參數並把該是數字的轉換為數字
				const discount_rate =
					couponAry.find((cp) => cp.coupon_id == cid).discount_rate * 1 || 1;
				const type = couponAry.find((cp) => cp.coupon_id == cid).type || '';
				const maximumDiscount =
					couponAry.find((cp) => cp.coupon_id == cid).maximumDiscount * 1 || '';
				const minimumSpend =
					couponAry.find((cp) => cp.coupon_id == cid).minimumSpend * 1 || '';

				// console.log(discount_rate, type, maximumDiscount, minimumSpend);

				let afterDiscount;
				let discountMsg = '';
				let shopTotal;
				nextCheckPay.forEach((shop) => {
					if (shop.shop_id == sid) {
						shopTotal = shop.shopTotal;

						if (shopTotal > minimumSpend) {
							//符合優惠券的折扣條件
							discountMsg = '成功使用折扣';
							const shopDiscount =
								shopTotal - shopTotal * discount_rate > maximumDiscount
									? maximumDiscount * 1
									: shopTotal - shopTotal * discount_rate;

							afterDiscount = Math.floor(shopTotal - shopDiscount); //必須要是整數
						} else {
							showMsg = true;
							throw new Error(`金額要超過$${minimumSpend.toLocaleString()}`);
						}
					}
				});

				//重組nextCheckPay
				nextCheckPay = checkPay.map((shop) => {
					if (shop.shop_id == sid) {
						return {
							...shop,
							coupon_id: cid,
							discount_rate: discount_rate,
							type: type,
							maximumDiscount: maximumDiscount,
							minimumSpend: minimumSpend,
							afterDiscount: afterDiscount,
							discountMsg: discountMsg,
						};
					}
					return shop;
				});

				//重組couponAry
				nextCouponAry = nextCouponAry.map((cp) => {
					if (cp.coupon_id == cid) {
						return { ...cp, selected_shop_id: sid };
					}
					return cp;
				});

				// setCouponAry(nextCouponAry);
				// setCheckPay(nextCheckPay);
			}
		} catch (e) {
			console.log(e.message);
			if (showMsg) {
				Swal.fire({
					title: e.message,
					icon: 'warning',
				});
			}
		} finally {
			setCouponAry(nextCouponAry);
			setCheckPay(nextCheckPay);
		}
	};

	//🔧處理優惠券過期判斷的函式
	const CouponIsExpired = (endDate) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const expiryDate = new Date(endDate);
		expiryDate.setHours(0, 0, 0, 0);
		return expiryDate < today;
	};

	//處理登入狀態
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
				const availableCoupon = userCouponAry.data
					.filter((cp) => {
						//篩除過期,停用,及未被領取的優惠券
						return (
							!CouponIsExpired(cp.end_date) &&
							cp.activation === 1 &&
							cp.user_collected === 1 &&
							cp.used_time == null
						);
					})
					.map((cp) => {
						return {
							...cp,
							selected_shop_id: null,
						};
					});

				setCouponAry(availableCoupon);

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
								coupon_id: null,
						  }
						: {
								way: '',
								name: '',
								phone: '',
								address: '',
								note: '',
								coupon_id: null,
						  };
				} else {
					shipInfo = {
						way: '',
						name: '',
						phone: '',
						address: '',
						note: '',
						coupon_id: null,
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
					let shopTotal = shop.cart_content.reduce((sum, pd) => {
						return sum + pd.price * pd.quantity * pd.discount;
					}, 0);
					return {
						...shop,
						...shipInfo,
						shopTotal,
						user_id,
					};
				}); //將運輸資運匯入至每個商家物件內

				setCheckPay(myCart.user_cart);
			} catch (e) {
				console.error('❌初始化購物車時發生錯誤:', e);
			}
		};

		initCheck();
	}, []);

	useEffect(() => {
		console.log('checkPay is changed:', checkPay);
		//優惠券的打折

		//計算平台的總價格
		let originPrice = 0;
		let shipPrice = 0;
		let CouponDiscount = 0;
		let finalPrice = 0;

		checkPay.forEach((shop) => {
			//運費的計算
			// if (shop.way) {
			// 	switch (shop.way) {
			// 		case '1':
			// 			//超商運費$60
			// 			shipPrice += 60;
			// 			break;
			// 		case '2':
			// 			//宅配先設定為$120
			// 			shipPrice += 100;
			// 			break;
			// 		default:
			// 			shipPrice += 0;
			// 	}
			// }
			if (shop.ship_pay) {
				shipPrice += shop.ship_pay;
			}

			originPrice += shop.shopTotal;
			if (shop.afterDiscount) {
				CouponDiscount += shop.shopTotal - shop.afterDiscount;
			}
		});

		finalPrice = originPrice + shipPrice - CouponDiscount;

		setPriceCount({
			originPrice,
			shipPrice,
			CouponDiscount,
			finalPrice,
		});
	}, [checkPay]);
	
	useEffect(() => {
		console.log('store711 is cheanged', store711);

		if (store711.storeid && processingShopId) {  // 確保有商店 ID 和正在處理的商店
		  console.log('選擇門市資訊:', store711);
		  console.log('正在處理商店:', processingShopId);
		  
		  const nextCheckPay = checkPay.map((shop) => {
			if (shop.shop_id === processingShopId) {  // 使用追蹤的商店 ID
			  return {
				...shop,
				way: '1',  // 設置為超商取貨
				address: `${store711.storename} (${store711.storeid}) - ${store711.storeaddress}`,
				ship_pay: 60
			  };
			}
			return shop;
		  });
	  
		  setCheckPay(nextCheckPay);
		  //setProcessingShopId(null);  // 重置處理狀態
		}
	  }, [store711, processingShopId]);  // 同時監聽 store711 和 processingShopId

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
		// console.log('couponAry is chenged', couponAry);
	}, [couponAry]);

	useEffect(() => {
		// console.log('付款方式', payWay);

		// 將付款方式放入每個shop物件中
		let nextCheckPay = [...checkPay];
		nextCheckPay = nextCheckPay.map((shop) => {
			return {
				...shop,
				payment: payWay,
			};
		});

		setCheckPay(nextCheckPay);
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
												<div className="d-flex justify-content-between mb-2">
													<div className="">已使用的優惠: </div>
													<h4 className="fw-bold h5">
														{!shop.coupon_id ? (
															`小計 $${shop.shopTotal.toLocaleString()}`
														) : (
															<del>
																小計 $
																{shop.shopTotal.toLocaleString()}
															</del>
														)}
													</h4>
												</div>
												<div className="d-flex justify-content-between flex-row">
													<select
														className="form form-control w-50"
														value={shop.coupon_id || ''}
														onChange={(e) => {
															handleSelectCoupon(
																shop.shop_id,
																e.target.value
															);
														}}
													>
														<option value="">未使用優惠券</option>
														{couponAry.map((cp) => (
															<option
																key={cp.coupon_id}
																value={cp.coupon_id}
															>
																{cp.name} (至少$
																{Math.floor(cp.minimumSpend)} |
																最高折$
																{Math.floor(cp.maximumDiscount)})
															</option>
														))}
													</select>
													{shop.coupon_id && (
														<div className="fw-bold text-danger h5 d-flex flex-row align-items-center">
															<h4 className="discount me-2">
																折抵-
																{(
																	shop.shopTotal -
																	shop.afterDiscount
																).toLocaleString()}
																/
															</h4>
															<h3 className="finalShop fw-bold">
																小計$
																{shop.afterDiscount.toLocaleString()}
															</h3>
														</div>
													)}
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
														let ship_pay = 0;
														if (newData == 1) {
															ship_pay = 60;
														} else if (newData == 2) {
															ship_pay = 100;
														}
														// 創建新的陣列，保持不可變性
														const nextCheckPay = checkPay.map(
															(store) => {
																if (
																	store.shop_id === shop.shop_id
																) {
																	return {
																		...store, // 展開運算符創建新物件
																		way: newData,
																		ship_pay,
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
																handleShipment(shop.shop_id);
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
														className="ZRT-btn btn-lpnk rounded-pill"
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
									<div className="col-12 col-lg-4 p-4 text-end">
										<h3 className="text-danger">
											商品總計 +NT$ {priceCount.originPrice}
										</h3>
										<h3>運費 +NT$ {priceCount.shipPrice}</h3>
										<h3>優惠券折抵 -NT$ {priceCount.CouponDiscount}</h3>
										{/* <h3>優惠折扣 NT$ -20</h3> */}
										<br />
										<h2 className="fw-bolder">
											總金額 NT${' '}
											<span className="text-danger">
												{priceCount.finalPrice}
											</span>
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
