import { produce } from 'immer';
import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { isNumber } from 'lodash';

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
	const [checkPay, setCheckPay] = useState([]);

	const user_id = 2; //💡暫時的資料之後要從userContext取出
	const [firstRender, setFirstRender] = useState(true); //可能用不到

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
		const userCart = localCart.find((c) => c.user_id === user_id);
		if (userCart) {
			//設置當前用戶購物車內容
			setCart(userCart.user_cart);
		} else {
			//localStorage沒有這個用戶就加一下唄
			localCart.push({
				user_id: user_id,
				selectedAll: false,
				user_cart: [],
			});
			localStorage.setItem('cart', JSON.stringify(localCart));
			const newUserCart = localCart.find((c) => c.user_id === user_id);
			setCart(newUserCart.user_cart);
		}

		console.log('✅購物車初始化完成,目前使用測試登入的user_id=' + user_id);
	}, []);

	// 當購物車發生變化時更新 localStorage
	useEffect(() => {
		// console.log('cart發生變化:', cart);

		// if (cart.length > 0) {
		// 	const storedCart = JSON.parse(localStorage.getItem('cart'));

		// 	// 更新特定用户的購物車
		// 	const updatedCart = storedCart.map((cartItem) =>
		// 		cartItem.user_id === user_id ? { ...cartItem, user_cart: cart } : cartItem
		// 	);

		// 	// console.log('cart發生改變,設定到localStorage');
		// 	localStorage.setItem('cart', JSON.stringify(updatedCart));
		// }
		// if (!firstRender) {
		// 	if (cart.length == 0) {
		// 		// 如果 cart 為空，移除特定用户的購物車
		// 		const storedCart = JSON.parse(localStorage.getItem('cart'));
		// 		const updatedCart = storedCart.filter((cartItem) => cartItem.user_id !== user_id);

		// 		// console.log('cart發生改變,設定到localStorage');
		// 		localStorage.setItem('cart', JSON.stringify(updatedCart));
		// 		// localStorage.setItem('cart', JSON.stringify(storedCart));
		// 	}
		// }

		const storedCart = JSON.parse(localStorage.getItem('cart'));
		const updatedCart = storedCart.find((cartItem) => cartItem.user_id == user_id);
		updatedCart.user_cart = cart;
		localStorage.setItem('cart', JSON.stringify(storedCart));

		setFirstRender(false);
	}, [cart]);

	//購物車各種函式組合
	const handleCart = (cart, ref, action) => {
		let nextCart = [...cart]; //接收當前用戶的購物車內容
		let itemAry = [];
		let found;
		let totalNumber = 0;
		let totalPrice = 0;

		switch (action) {
			case 'increase':
				// 處理增加項目

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
					found.quantity += 1;
					setCart(nextCart);
				} else if (!found && refIsOk) {
					//判斷購物車內部shop_id
					let shopId;
					let foundShopInCart = false;
					(async () => {
						//❎沒有處理產品id不正確的問題
						const response = await axios.get(
							`http://localhost:3005/api/cart/product/${ref}`
						);
						shopId = response.data[0].shop_id;
						console.log('shop_id:', shopId);

						// 判定現存購物車中是否含有這家商店
						nextCart.forEach((shop) => {
							if (shop.shop_id == shopId) foundShopInCart = true;
						});

						if (foundShopInCart) {
							nextCart.forEach((shop) => {
								if (shop.shop_id == shopId) {
									shop.cart_content.push({
										product_id: ref,
										quantity: 1,
										selected: false,
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
										quantity: 1,
										selected: false,
									},
								],
							});
						}

						console.log(nextCart);
						setCart(nextCart);
						return nextCart;
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
				found.quantity -= 1;

				//當產品數量被刪除光光的情況
				if (found.quantity <= 0) {
					nextCart.forEach((shop) => {
						shop.cart_content = shop.cart_content.filter((p) => p.product_id !== ref);
					});
					//當某個商家商品全空的情況
					nextCart = nextCart.filter((shop) => shop.cart_content.length > 0);
				}

				setCart(nextCart);
				return nextCart;

			case 'delete':
				//處理刪除項目
				console.log('deleted product', ref);

				// 建立新的購物車陣列副本
				nextCart = nextCart
					.map((shop) => ({
						...shop,
						cart_content: shop.cart_content.filter((p) => p.product_id !== ref),
					}))
					.filter((shop) => shop.cart_content.length > 0);

				// nextCart.forEach((shop) => {
				// 	shop.cart_content = shop.cart_content.filter((p) => p.product_id !== ref);
				// });
				// nextCart = nextCart.filter((shop) => shop.cart_content.length > 0);

				setCart(nextCart);
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
				nextCart.forEach((shop) => {
					shop.cart_content = shop.cart_content.filter((pd) => pd.selected == false);
				});
				nextCart = nextCart.filter((shop) => shop.cart_content.length > 0);

				setCart(nextCart);
				return nextCart;

			case 'CheckOrder':
				//結帳確認頁所顯示的待結帳商品❌可能用不太到
				nextCart.forEach((shop) => {
					shop.cart_content = shop.cart_content.filter((pd) => {
						pd.selected == true;
					});
				});

				setCheckPay(nextCart);
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
