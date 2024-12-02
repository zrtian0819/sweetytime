import React, { useState, useEffect } from 'react';
import sty from './cart-blcok.module.scss';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useCart } from '@/context/cartContext';
import axios from 'axios';

export default function CartBlock({ children, shopId, shopSelected }) {
	const { cart, setCart, handleCart } = useCart();
	const [shop, setShop] = useState('');
	const [shopName, setShopName] = useState(shopId);

	useEffect(() => {
		// 抓取商家名稱
		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/shop/${shopId}`)
			.then((res) => {
				// console.log(res.data);
				setShop(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		//找到商家名稱
		if (shop != '') {
			const shopName = shop.name;
			setShopName(shopName);

			//將商家名稱設定到cart裡面
			const nextCart = cart;
			nextCart.forEach((shop) => {
				if (shop.shop_id == shopId) {
					shop.shop_name = shopName;
				}
			});
			setCart(nextCart);
		}
	}, [shop]);

	return (
		<>
			<div className={sty['ZRT-cartArea']}>
				<label className={sty['ZRT-shopName']}>
					<FormControlLabel
						control={
							<Checkbox
								checked={shopSelected}
								sx={{
									color: '#fe6f67',
									'&.Mui-checked': { color: '#fe6f67' },
								}}
								onClick={() => {
									handleCart(cart, shopId, 'toggleShopSelectAll');
								}}
							/>
						}
						label={shopName}
					/>
				</label>
				<div className="container-fluid mb-3">
					<div className={`${sty['ZRT-tHead']} row px-0 py-1 px-lg-2`}>
						<div className="col-1 ZRT-center">選取</div>
						<div className="col-2 ZRT-center">商品相片</div>
						<div className="col-4 col-lg-5 ZRT-center">品名/價格</div>
						<div className="col-3 col-lg-2 ZRT-center">選擇數量</div>
						<div className="col-2 ZRT-center">移除商品</div>
					</div>
				</div>
				<main>{children}</main>
			</div>
		</>
	);
}
