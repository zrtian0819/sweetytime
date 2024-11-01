import React, { useState, useEffect } from 'react';
import sty from './cart-blcok.module.scss';
import { FormControlLabel, Checkbox } from '@mui/material';

export default function CartBlock({ children, shopName }) {
	return (
		<>
			<div className={sty['ZRT-cartArea']}>
				<label className={sty['ZRT-shopName']}>
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
						label={shopName}
					/>
				</label>

				<main>{children}</main>
			</div>
		</>
	);
}
