import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import CartItem from '@/components/cart/cart-item';
import Link from 'next/link';
import { useCart } from '@/context/cartContext';
import CartBlock from '@/components/cart/cart-block';
import LoaderThreeDots from '@/components/loader/loader-threeDots';

export default function Cart(props) {
	const { cart, setCart, handleCart } = useCart();
	const [input, setInput] = useState(0);
	const [loading, setLoading] = useState(true);

	const finishRender = () => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	useEffect(() => {
		if (cart.length == 0) {
			setLoading(false);
		}
	}, []);

	return (
		<>
			<Header />

			<div className={`${Styles['ZRT-cartBody']}`}>
				{/* 測試區 */}
				<div className="inputArea d-flex justify-content-center mb-4">
					<input
						className="form form-control w-50"
						type="text"
						value={input}
						placeholder="甜點id"
						onChange={(e) => {
							setInput(e.target.value);
						}}
					/>
					<div
						className="fakeBtn ZRT-btn btn-lpnk ZRT-click"
						onClick={() => {
							// setCart(handleCart(cart, 20, 'increase'));
							handleCart(cart, input, 'increase');
						}}
					>
						新增甜點(測試)
					</div>
				</div>
				<div className="container-md d-flex justify-content-start align-items-center flex-column">
					<StepBar />
					{loading ? <LoaderThreeDots /> : ''}
					<div className={`d-flex flex-column w-100 mt-4 ${loading ? 'opacity-0' : ''}`}>
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
						{/* {console.log('渲染前cart', cart)} */}
						{!cart || cart.length == 0 ? (
							<h2 className="text-center mt-5 text-secondary ZRT-ls-1">
								不喜歡吃甜點嗎? 您的購物車空蕩蕩。
								<br />
								<Link
									href="/product"
									className="mt-2 text-pnk text-decoration-underline d-inline-block"
								>
									來去逛逛
								</Link>
							</h2>
						) : (
							cart.map((shop, i, cart) => {
								return (
									<CartBlock
										key={cart[i].shop_id}
										shopName={cart[i].shop_id} //待修改
										shopId={cart[i].shop_id}
										shopSelected={shop.selectedShopAll}
									>
										{shop.cart_content.map((product, j) => {
											return (
												<CartItem
													key={product.product_id}
													pid={product.product_id}
													count={product.quantity}
													selected={product.selected}
													// setLoading={setLoading}
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
							<div className={`${Styles['ZRT-total']} container-fluid`}>
								<div className="row">
									<div className="col-12 col-md-6 d-flex align-items-center justify-content-start mb-5 mb-md-0">
										共{handleCart(cart, '_', 'countNumber')}件商品 ，已選擇
										{handleCart(cart, '_', 'selectedCountNumber')}件
									</div>
									<div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-end">
										<div className="me-0 me-md-4 fs-4 text-danger mb-4 mb-md-0">
											總金額 NT${handleCart(cart, '_', 'countPrice')}
										</div>
										{handleCart(cart, '_', 'selectedCountNumber') == 0 ? (
											<div
												className="ZRT-btn btn-gry ZRT-ls-3"
												onClick={() => {
													alert('沒有選甜點是要結什麼帳?');
												}}
											>
												我要結帳
											</div>
										) : (
											<Link
												className="ZRT-btn btn-lpnk ZRT-click ZRT-ls-3"
												href="/cart/checkout"
												// href={''}
											>
												我要結帳
											</Link>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* <pre>{JSON.stringify(cart)}</pre> */}

			<Footer />
			{finishRender()}
		</>
	);
}
