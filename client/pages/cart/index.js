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
	const { cart, setCart } = useCart();
	const c_user_id = 2;

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

						{/* 物件通通放這裡 */}
						{/* <CartBlock shopName={'chizUp'}>
							<CartItem />
							<CartItem />
							<CartItem />
						</CartBlock> */}

						{console.log(cart)}
						{cart.map((shop, i) => {
							return (
								<CartBlock key={i} shopName={i}>
									{shop.cart_content.map((product, j) => {
										return (
											<CartItem
												key={j}
												name={product.product_id}
												count={product.count}
											/>
										);
									})}
								</CartBlock>
							);
						})}

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
