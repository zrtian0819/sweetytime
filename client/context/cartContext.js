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

//reducer基礎架構
const reducer = (state, action) => {
	switch (action) {
		case 'add':
			return state + 1;
		default:
			return state;
	}
};

const cartContext = createContext(null);
export const useCart = () => useContext(cartContext); //useCart給予夥伴們調用

export function CartProvider({ children }) {
	const [cart, setCart] = useState([]);
	const user_id = 2; //測試用假設登入者為user 2

	// 購物車的初始化
	let localCart;
	useEffect(() => {
		//設定初始購物車用的
		localStorage.setItem('cart', JSON.stringify(initialCart));

		localCart = JSON.parse(localStorage.getItem('cart'));

		//localStoage沒有資料的情況
		if (!localCart) {
			setCart([]);
			return;
		}

		const { user_cart } = localCart.find((c) => {
			return (c.user_id = user_id);
		});

		setCart(user_cart);
	}, []);

	useEffect(() => {
		console.log('cart發生改變,待存入localStorage');
	}, [cart]);

	console.log('id:' + user_id + '的購物車:', cart);

	return <cartContext.Provider value={{ cart, setCart }}>{children}</cartContext.Provider>;
}
