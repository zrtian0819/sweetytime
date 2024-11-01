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
        // 初始化 localStorage
        const storedCart = localStorage.getItem('cart');
        if (!storedCart) {
            localStorage.setItem('cart', JSON.stringify(initialCart));
        }

        // 从 localStorage 获取购物车
        const localCart = JSON.parse(localStorage.getItem('cart'));
        
        // 找到当前用户的购物车并设置
        const userCart = localCart.find((c) => c.user_id === user_id);
        if (userCart) {
            // 设置当前用户的购物车内容
            setCart(userCart.user_cart);
        }
    }, []); // 空依赖数组，仅在组件挂载时运行

    // 当购物车发生变化时更新 localStorage
    useEffect(() => {
        if (cart.length > 0) {
            const storedCart = JSON.parse(localStorage.getItem('cart'));
            
            // 更新特定用户的购物车
            const updatedCart = storedCart.map(cartItem => 
                cartItem.user_id === user_id 
                    ? { ...cartItem, user_cart: cart } 
                    : cartItem
            );
            
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    }, [cart]);

	return (
		<cartContext.Provider value={{ cart, setCart, handleCart }}>
			{children}
		</cartContext.Provider>
	);
}
