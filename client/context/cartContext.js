import React, { useState, useEffect, createContext, useContext } from 'react';

//暫時的購物車物件
const initialCart = [
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
		],
	},
];

const cartContext = createContext(null);
export const useCart = () => useContext(cartContext); //useCart給予夥伴們調用

export function CartProvider({ children }) {
	const [cart, setCart] = useState(initialCart);
	// console.log(cart);

	return <cartContext.Provider value={{ cart, setCart }}>{children}</cartContext.Provider>;
}
