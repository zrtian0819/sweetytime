import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { showCustomToast } from '@/components/toast/CustomToastMessage';

//暫時的購物車物件
let initialCart = [
	{
		user_id: 2,
		selectedAll: false,
		user_cart: [
			{
				shop_id: 31,
				selectedShopAll: false,
				cart_content: [
					{
						product_id: 15,
						quantity: 1,
						selected: false,
					},
					{
						product_id: 12,
						quantity: 1,
						selected: false,
					},
					{
						product_id: 13,
						quantity: 1,
						selected: false,
					},
				],
			},
			{
				shop_id: 4,
				selectedShopAll: false,
				cart_content: [
					{
						product_id: 25,
						quantity: 1,
						selected: false,
					},
					{
						product_id: 45,
						quantity: 5,
						selected: false,
					},
				],
			},
		],
	},
	{
		user_id: 3,
		selectedAll: false,
		user_cart: [
			{
				shop_id: 2,
				selectedShopAll: false,
				cart_content: [
					{
						product_id: 15,
						quantity: 1,
						selected: false,
					},
					{
						product_id: 12,
						quantity: 1,
						selected: false,
					},
				],
			},
		],
	},
];

const cartContext = createContext(null);
export const useCart = () => useContext(cartContext); //useCart給予夥伴們調用

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [currentUser, SetCurrentUser] = useState(undefined);
	const router = useRouter();
	const { user } = useUser();

	useEffect(() => {
		//判定登入者
		if (user) {
			SetCurrentUser(user.id);
			// console.log('購物車的判斷:目前的登入者user id:', user.id);
		} else {
			console.log('購物車的判斷:目前是登出狀態');
			const protectedPage = ['/cart', '/cart/checkout', '/cart/checkoutDone'];

			console.log(cart);
			if (!user && protectedPage.includes(router.pathname)) {
				// 可以儲存當前路徑，登入後再跳回來
				router.push({
					pathname: '/login',
					query: { returnUrl: router.asPath },
				});
			}
		}
	}, [router.pathname]);

	useEffect(() => {
		// 購物車的初始化
		const storedCart = localStorage.getItem('cart');
		if (!storedCart) {
			console.log('✅購物車快速填入被執行');
			localStorage.setItem('cart', JSON.stringify(initialCart));
		}

		// 從 localStorage 獲取購物車
		let localCart = JSON.parse(localStorage.getItem('cart'));

		// 找到當前用戶購物車並設置
		const userCart = localCart.find((c) => c.user_id === currentUser);
		if (userCart) {
			//設置當前用戶購物車內容
			setCart(userCart.user_cart);
		} else {
			//localStorage沒有這個用戶就加一下唄
			localCart.push({
				user_id: currentUser,
				selectedAll: false,
				user_cart: [],
			});
			localStorage.setItem('cart', JSON.stringify(localCart));
			const newUserCart = localCart.find((c) => c.user_id === currentUser);
			setCart(newUserCart.user_cart);
		}

		if (user) {
			console.log('✅購物車:初始化完成,目前登入的user_id=' + currentUser);
		}
	}, [currentUser]);

	// 當購物車發生變化時要更新 localStorage
	useEffect(() => {
		if (cart.length > 0) {
			console.log('🛒購物車內容:', cart);
		}
		const storedCart = JSON.parse(localStorage.getItem('cart'));
		const updatedCart = storedCart.find((cartItem) => cartItem.user_id == currentUser);
		updatedCart.user_cart = cart;
		localStorage.setItem('cart', JSON.stringify(storedCart));
	}, [cart]);

	//購物車各種函式組合
	const handleCart = (cart, ref, action, addAmount = 1) => {
		let nextCart = [...cart]; //接收當前用戶的購物車內容
		let itemAry = [];
		let found;
		let totalNumber = 0;
		let totalPrice = 0;

		if (!user) {
			Swal.fire({
				title: '請登入',
				text: '請登入後再使用購物車',
				icon: 'warning',
			});
			// router.push('/login');
			return;
		}

		switch (action) {
			case 'increase':
				ref = Number(ref);
				let refIsOk = true;
				if (ref <= 0 || ref >= 680 || isNaN(ref)) {
					console.log('❌傳入的值不正確');
					refIsOk = false;
				}

				nextCart.forEach((shop) => {
					itemAry = [...itemAry, ...shop.cart_content];
				});
				found = itemAry.find((pd) => {
					return pd.product_id == ref;
				});
				//判定是否有在既有的購物車中找到這個項目
				if (found) {
					console.log('found.stocks:', found.stocks);
					console.log('found.quantity:', found.quantity);
					if (found.stocks < found.quantity + addAmount) {
						//需求添加量超過庫存的情況
						Swal.fire({
							title: '庫存量不足',
							text: `只能再幫您添加${found.stocks - found.quantity}件!`,
							icon: 'warning',
						});
						if (found.stocks - found.quantity == 0) {
							//不能再新增商品的情況
							showCustomToast('', '', `新增商品失敗！`);
						} else {
							//還可以新增商品的情況
							showCustomToast(
								'add',
								'',
								`已新增${found.stocks - found.quantity}件商品！`
							);
							found.quantity = found.stocks;
							setCart(nextCart);
						}

						return;
					} else {
						//需求添加量超沒有超過庫存的情況
						found.quantity += addAmount;
						setCart(nextCart);
						showCustomToast('add', '', `已新增${addAmount}件商品！`);
					}
				} else if (!found && refIsOk) {
					//購物車中沒有此產品的情況並且傳入的產品id合法
					//判斷購物車內部shop_id
					let shopId;
					let foundShopInCart = false;

					(async () => {
						//❎沒有處理產品id不正確的問題
						const response = await axios.get(
							`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/product/${ref}`
						);
						const product = response.data[0];
						shopId = product.shop_id;

						if (product.stocks < addAmount) {
							Swal.fire({
								title: '庫存量不足',
								text: `只能再添加${product.stocks}件!`,
								icon: 'warning',
							});

							addAmount = product.stocks;

							if (addAmount > 0) {
								showCustomToast('add', '', `只新增${addAmount}件商品！`);
							} else {
								showCustomToast('', '', `此商品不能再新增！`);
							}
						} else {
							showCustomToast('add', '', `已新增${addAmount}件商品！`);
						}
						// console.log('shop_id:', shopId);

						// 判定現存購物車中是否含有這家商店
						nextCart.forEach((shop) => {
							if (shop.shop_id == shopId) foundShopInCart = true;
						});

						if (addAmount > 0) {
							//一律只有在加入數量是大於0時才可以做修改
							if (foundShopInCart) {
								nextCart.forEach((shop) => {
									if (shop.shop_id == shopId) {
										shop.cart_content.push({
											product_id: ref,
											quantity: addAmount,
											selected: false,
											stocks: product.stocks,
										});
									}
								});
							} else {
								nextCart.push({
									shop_id: shopId,
									selectedShopAll: false,
									cart_content: [
										{
											product_id: ref,
											quantity: addAmount,
											selected: false,
											stocks: product.stocks,
										},
									],
								});
							}

							console.log('nextCart:', nextCart);
							setCart(nextCart);
						}
					})();
				}
				return nextCart;

			case 'decrease':
				//處理減少項目
				nextCart.forEach((shop) => {
					itemAry = [...itemAry, ...shop.cart_content];
				});
				found = itemAry.find((pd) => {
					return pd.product_id == ref;
				});

				if (found.quantity - 1 == 0) {
					Swal.fire({
						title: '確定要從購物車移除此商品嗎?',
						showDenyButton: true,
						showCancelButton: false,
						confirmButtonText: '確定',
						denyButtonText: `取消`,
					}).then((result) => {
						if (result.isConfirmed) {
							found.quantity -= 1;

							//當產品數量被刪除光光的情況
							if (found.quantity <= 0) {
								nextCart.forEach((shop) => {
									shop.cart_content = shop.cart_content.filter(
										(p) => p.product_id !== ref
									);
								});
								//當某個商家商品全空的情況
								nextCart = nextCart.filter((shop) => shop.cart_content.length > 0);
							}
							setCart(nextCart);
							showCustomToast('add', '', '已從購物車移除商品！');
						} else if (result.isDenied) {
						}
					});
				} else {
					found.quantity -= 1;
					setCart(nextCart);
					showCustomToast('add', '', '已減少1件商品！');
				}

				return nextCart;

			case 'delete':
				//處理刪除項目
				// console.log('deleted product', ref);

				Swal.fire({
					title: '確定要從購物車移除此商品嗎?',
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: '確定',
					denyButtonText: `取消`,
				}).then((result) => {
					if (result.isConfirmed) {
						// 建立新的購物車陣列副本
						nextCart = nextCart
							.map((shop) => ({
								...shop,
								cart_content: shop.cart_content.filter((p) => p.product_id !== ref),
							}))
							.filter((shop) => shop.cart_content.length > 0);

						setCart(nextCart);
						showCustomToast('add', '', '已從購物車移除商品！');
					} else if (result.isDenied) {
					}
				});

				return nextCart;

			case 'countNumber':
				//處理計算數量
				totalNumber = 0;
				nextCart.forEach((shop) => {
					shop.cart_content.forEach((pd) => (totalNumber += pd.quantity));
				});

				return totalNumber;

			case 'selectedCountNumber':
				//處理計算數量
				totalNumber = 0;
				nextCart.forEach((shop) => {
					shop.cart_content.forEach((pd) => [
						(totalNumber += pd.selected ? pd.quantity : 0),
					]);
				});

				return totalNumber;

			case 'toggleSelectAll':
				// 處理選擇全部項目(目前購物車結構無法處理)
				console.log('toggleSelectAll目前暫未提供功能💔');
				return;
				nextCart.forEach((shop) => {
					itemAry = [...itemAry, ...shop.cart_content];
				});
				itemAry.map((p) => {
					p.selected = !p.selected;
				});
				setCart(nextCart);
				return nextCart;

			case 'toggleShopSelectAll':
				const targetShop = nextCart.find((shop) => shop.shop_id == ref);

				targetShop.selectedShopAll = !targetShop.selectedShopAll;

				if (targetShop.selectedShopAll) {
					targetShop.cart_content.forEach((p) => (p.selected = true));
				} else {
					targetShop.cart_content.forEach((p) => (p.selected = false));
				}

				setCart(nextCart);
				return nextCart;

			case 'toggleSingleSelected':
				//處理選擇單個項目

				nextCart.forEach((shop) => {
					itemAry = [...itemAry, ...shop.cart_content];
				});
				found = itemAry.find((pd) => {
					return pd.product_id == ref;
				});
				found.selected = !found.selected;

				//判定是否全部被選取
				let allProductSelected;
				nextCart.forEach((shop) => {
					allProductSelected = shop.cart_content.every((p) => p.selected == true);
					shop.selectedShopAll = allProductSelected;
				});

				setCart(nextCart);
				return nextCart;

			case 'countPrice':
				//計算已選取的總金額
				nextCart.forEach((shop) => {
					itemAry = [...itemAry, ...shop.cart_content];
				});

				itemAry.forEach((pd) => {
					if (pd.selected) {
						totalPrice += pd.price * pd.quantity * pd.discount;
					}
				});

				return totalPrice;

			case 'afterBuyClear':
				//清空已經被結帳的商品
				console.log('afterBuyClear nextCart:', nextCart);
				nextCart.forEach((shop) => {
					shop.cart_content = shop.cart_content.filter((pd) => pd.selected == false);
				});
				nextCart = nextCart.filter((shop) => shop.cart_content.length > 0);

				setCart(nextCart);
				return nextCart;

			default:
				console.log('handleCart並未帶入正確參數');
				return cart;
		}
	};

	return (
		<cartContext.Provider value={{ cart, setCart, handleCart }}>
			{children}
		</cartContext.Provider>
	);
}
