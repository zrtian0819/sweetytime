import React, { useState, useEffect, useContext } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import CartItem from '@/components/cart/cart-item';
import Link from 'next/link';
import { FormControlLabel, Checkbox } from '@mui/material';
import { cartContext } from '@/context/cartContext';
import { useCart } from '@/context/cartContext';
import CartBlock from '@/components/cart/cart-block';

export default function Cart(props) {
	const { cart, setCart, handleCart } = useCart();

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-cartBody']} `}>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					<StepBar />

					<div className="d-flex flex-column w-100 mt-4">
						{/* <FormControlLabel
							control={
								<Checkbox
									sx={{ color: '#fe6f67', '&.Mui-checked': { color: '#fe6f67' } }}
									onClick={() => {
										setCart(handleCart(cart, null, 'toggleSelectAll'));
									}}
								/>
							}
							label="選擇全部"
						/> */}
						{console.log('渲染前cart', cart)}
						{!cart || cart.length == 0 ? (
							<h2 className="text-center mt-5 text-secondary">
								不喜歡吃甜點嗎? 您的購物車空蕩蕩。
							</h2>
						) : (
							cart.map((shop, i, cart) => {
								return (
									<CartBlock
										key={i}
										shopName={cart[i].shop_id} //待修改
										shopId={cart[i].shop_id}
										shopSelected={shop.selectedShopAll}
									>
										{shop.cart_content.map((product, j) => {
											return (
												<CartItem
													key={j}
													name={product.product_id}
													pid={product.product_id}
													count={product.quantity}
													selected={product.selected}
												/>
											);
										})}
									</CartBlock>
								);
							})
						)}
						{!cart || cart.length == 0 ? (
							''
						) : (
							<div
								className={`${Styles['ZRT-total']} d-flex justify-content-between align-items-center`}
							>
								<span>已選擇{'?'}件商品</span>
								<span>
									<span className="me-4 fs-4 text-danger">總計 NT${'???'}</span>
									<Link
										className="ZRT-btn btn-lpnk ZRT-click"
										href="/cart/checkout"
									>
										前往結帳
									</Link>
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<pre>{JSON.stringify(cart)}</pre>
			<Footer />
		</>
	);
}
