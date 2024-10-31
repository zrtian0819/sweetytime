import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import CartItem from '@/components/cart/cart-item';
import Link from 'next/link';
import { FormControlLabel, Checkbox } from '@mui/material';

//暫時的購物車物件
let cart = [
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

export default function Cart(props) {
	useEffect(() => {
		//取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
		console.log('起始頁面觸發');
	}, []);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']} `}>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					<StepBar />

					<div className="d-flex flex-column w-100 mt-4">
						<FormControlLabel
							control={
								<Checkbox
									// defaultChecked
									sx={{ color: '#fe6f67', '&.Mui-checked': { color: '#fe6f67' } }}
								/>
							}
							label="選擇全部"
						/>
						{/* 每一個商家的區域 */}
						<div className={Styles['ZRT-cartArea']}>
							<label className={Styles['ZRT-shopName']}>
								<FormControlLabel
									control={
										<Checkbox
											// defaultChecked
											sx={{
												color: '#fe6f67',
												'&.Mui-checked': { color: '#fe6f67' },
											}}
										/>
									}
									label="ChizUp!(店家名)"
								/>
							</label>

							<CartItem />
							<CartItem />
							<CartItem />
						</div>
						{/* 每一個商家的區域 */}
						<div className={Styles['ZRT-cartArea']}>
							<label className={Styles['ZRT-shopName']}>
								<FormControlLabel
									control={
										<Checkbox
											defaultChecked
											sx={{
												color: '#fe6f67',
												'&.Mui-checked': { color: '#fe6f67' },
											}}
										/>
									}
									label="ChizDown!(店家名)"
								/>
							</label>

							<CartItem />
						</div>

						<div
							className={`${Styles['ZRT-total']} d-flex justify-content-between align-items-center`}
						>
							<span>已選擇{3}件商品</span>
							<span>
								<span className="me-4">總計 NT${5000}</span>
								<Link className="ZRT-btn btn-lpnk ZRT-click" href="/cart/checkout">
									前往結帳
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
