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

//購物車函式組合
const handleCart = (cart, pid, action) => {
	let nextCart = [...cart];
	let itemAry = [];
	let found;
	let totalNumber = 0;
	let totalPrice = 0;

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
			return nextCart;

		case 'countNumber':
			totalNumber = itemAry.reduce((acc, cur) => {
				return acc + cur.quantity;
			}, totalNumber);
			return totalNumber;

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
	let firstRender = true;

	// 購物車的初始化
	let localCart;
	useEffect(() => {
		//🚧🚧🚧🚧🚧此處程式仍舊異常
		// 初始化 localStorage
		const storedCart = localStorage.getItem('cart');
		console.log('storedCart', storedCart);
		if (!storedCart) {
			localStorage.setItem('cart', JSON.stringify(initialCart));
		}

		//從localStorage取得購物車
		localCart = JSON.parse(localStorage.getItem('cart'));
		console.log('localCart', localCart);
		//過濾為單一用戶的購物車;

		const user = localCart.find((c) => c.user_id == user_id);
		console.log(user);
		// console.log('localCart:', localCart);
		// setCart(user_cart);
		firstRender = false;
	}, []);

	//當購物車發生改變時
	useEffect(() => {
		if (!firstRender) {
			console.log('cart發生變化時', cart);
			localStorage.setItem('cart', JSON.stringify(cart));
		}
	}, [cart]);

	return (
		<cartContext.Provider value={{ cart, setCart, handleCart }}>
			{children}
		</cartContext.Provider>
	);
}
