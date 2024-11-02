import { produce } from 'immer';
import React, { useState, useEffect, createContext, useContext } from 'react';

//暫時的購物車物件
let initialCart = [
	{
		user_id: 2,
		user_cart: [
			{
				shop_id: 2,
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
		user_cart: [
			{
				shop_id: 2,
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

//購物車各種函式組合
const handleCart = (cart, pid, action) => {
	let nextCart = [...cart]; //接收當前用戶的購物車內容
	let itemAry = [];
	let found;
	let totalNumber = 0;
	let totalPrice = 0;

	let emptyUserCart = {
		user_id: null,
		user_cart: [
			{
				shop_id: null,
				cart_content: [],
			},
		],
	};

	let emptyProduct = {
		product_id: null,
		quantity: 1,
		selected: false,
	};

	switch (action) {
		case 'increase':
			nextCart.forEach((shop) => {
				itemAry = [...itemAry, ...shop.cart_content];
			});
			found = itemAry.find((pd) => {
				return pd.product_id == pid;
			});
			found.quantity += 1;
			return nextCart;

		case 'decrease':
			nextCart.forEach((shop) => {
				itemAry = [...itemAry, ...shop.cart_content];
			});
			found = itemAry.find((pd) => {
				return pd.product_id == pid;
			});
			found.quantity -= 1;

			//當產品數量被刪除光光的情況
			if (found.quantity <= 0) {
				nextCart.forEach((shop) => {
					shop.cart_content = shop.cart_content.filter((p) => p.product_id != pid);
				});
				//當某個商家商品全空的情況
				nextCart = nextCart.filter((shop) => shop.cart_content.length > 0);
			}

			return nextCart;

		case 'countNumber':
			totalNumber = itemAry.reduce((acc, cur) => {
				return cur.selected ? acc + cur.quantity : acc;
			}, totalNumber);
			return totalNumber;

		case 'toggleSelectAll':
			nextCart.forEach((shop) => {
				itemAry = [...itemAry, ...shop.cart_content];
			});
			itemAry.map((p) => {
				p.selected = !p.selected;
			});
			return nextCart;

		case 'toggleSingleSelected':
			console.log('處理點擊卻可爸');
			nextCart.forEach((shop) => {
				itemAry = [...itemAry, ...shop.cart_content];
			});
			found = itemAry.find((pd) => {
				return pd.product_id == pid;
			});
			found.selected = !found.selected;
			return nextCart;

		// case 'countPrice':
		// 	totalPrice = itemAry.reduce((acc, cur) => {
		// 		return acc + cur.quantity * cur.price;
		// 	}, totalNumber);
		// 	return totalNumber;

		default:
			return cart;
	}
};

const cartContext = createContext(null);
export const useCart = () => useContext(cartContext); //useCart給予夥伴們調用

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const user_id = 2; //測試用假設登入者為user 2
	const [firstRender, setFirstRender] = useState(true);

	// 購物車的初始化
	useEffect(() => {
		// 初始化 localStorage
		const storedCart = localStorage.getItem('cart');
		if (!storedCart) {
			localStorage.setItem('cart', JSON.stringify(initialCart));
		}

		// 從 localStorage 獲取購物車
		const localCart = JSON.parse(localStorage.getItem('cart'));

		// 找到當前用戶購物車並設置
		const userCart = localCart.find((c) => c.user_id === user_id);
		if (userCart) {
			//設置當前用戶購物車內容
			setCart(userCart.user_cart);
		}

		console.log('購物車初始化完成');
	}, []);

	// 當購物車發生變化時更新 localStorage
	useEffect(() => {
		console.log('cart發生變化:', cart);
		if (cart.length > 0) {
			const storedCart = JSON.parse(localStorage.getItem('cart'));

			// 更新特定用户的購物車
			const updatedCart = storedCart.map((cartItem) =>
				cartItem.user_id === user_id ? { ...cartItem, user_cart: cart } : cartItem
			);

			console.log('設定localStorage');
			localStorage.setItem('cart', JSON.stringify(updatedCart));
		}
		if (!firstRender) {
			if (cart.length == 0) {
				// 如果 cart 為空，移除特定用户的購物車
				const storedCart = JSON.parse(localStorage.getItem('cart'));
				const updatedCart = storedCart.filter((cartItem) => cartItem.user_id !== user_id);

				console.log('設定localStorage');
				localStorage.setItem('cart', JSON.stringify(updatedCart));
			}
		}

		setFirstRender(false);
	}, [cart]);

	return (
		<cartContext.Provider value={{ cart, setCart, handleCart }}>
			{children}
		</cartContext.Provider>
	);
}
