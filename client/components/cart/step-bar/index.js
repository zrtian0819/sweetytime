import React, { useState, useEffect } from 'react';
import Styles from './step-bar.module.scss';
import { useRouter } from 'next/router';

export default function StepBar({ step = 1 }) {
	const router = useRouter();
	const path = router.pathname;

	if (path == '/cart') {
		step = 1;
	} else if (path == '/cart/checkout') {
		step = 2;
	} else if (path == '/cart/checkoutDone') {
		step = 3;
	}

	return (
		<>
			<div className={Styles['ZRT-stepBar']}>
				<div
					className={`ZRT-btn rounded-pill ${step == 1 ? 'btn-lpnk' : 'btn-gry'}  ${
						Styles['ZRT-btn-style']
					}`}
				>
					購物車
				</div>
				<div className={Styles['ZRT-bar']}></div>
				<div
					className={`ZRT-btn rounded-pill ${step == 2 ? 'btn-lpnk' : 'btn-gry'} ${
						Styles['ZRT-btn-style']
					}`}
				>
					結帳及付款資訊
				</div>
				<div className={Styles['ZRT-bar']}></div>
				<div
					className={`ZRT-btn rounded-pill ${step == 3 ? 'btn-lpnk' : 'btn-gry'}  ${
						Styles['ZRT-btn-style']
					}`}
				>
					訂單送出
				</div>
			</div>
		</>
	);
}
