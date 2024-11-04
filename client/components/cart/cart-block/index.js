import React, { useState, useEffect } from 'react';
import sty from './cart-blcok.module.scss';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useCart } from '@/context/cartContext';

export default function CartBlock({ children, shopId, shopName, shopSelected }) {
	const { cart, setCart, handleCart } = useCart();

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
									setCart(handleCart(cart, shopId, 'toggleShopSelectAll'));
								}}
							/>
						}
						label={shopName}
					/>
				</label>

				<main>{children}</main>
			</div>
		</>
	);
}
