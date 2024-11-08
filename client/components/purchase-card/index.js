import React from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Image from 'next/image';
import Window from './window';
import { useUser } from '@/context/userContext';

export default function Purchase() {
	const { user } = useUser();
	useEffect(() => {
		// 確保有用戶ID才發送請求
		if (user?.id) {
		  setIsLoading(true);
		  // 使用新的API端點獲取特定用戶的優惠券
		  axios
			.get(`http://localhost:3005/api/coupon/my-coupons`)
			.then((response) => {
			  // 處理響應數據，添加狀態標記
			  const processedCoupons = response.data.map(coupon => ({
				...coupon,
				status: new Date(coupon.end_date) > new Date() ? 'AVAILABLE' : 'EXPIRED'
			  }));
			  setCoupon(processedCoupons);
			})
			.catch((error) => {
			  console.error('Error fetching user coupons:', error);
			  // 可以添加錯誤處理，比如顯示錯誤消息
			})
			.finally(() => {
			  setIsLoading(false);
			});
		}
	  }, [user?.id]); // 依賴於用戶ID

	return (
		<div className={`${Styles['TIL-Details']} p-3 d-flex flex-column`}>
			<p className="text-stard my-auto">
				訂單編號: <span>sgawejhosle2915</span>
			</p>
			<div className="d-flex flex-column justify-content-between">
				<div className="d-flex justify-content-end">
					<Window />
				</div>
				<div className="d-flex flex-sm-row flex-column-reverse justify-content-between">
					<div className="mt-2">
						<h4 className="m-0">備註:</h4>
						<h4 className="my-auto" style={{ color: '#7caec8' }}>
							已使用的優惠：
							<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
								滿千折百
							</span>
						</h4>
					</div>

					<div className="d-flex flex-column justify-content-center align-items-start align-items-sm-end">
						<div className={`${Styles['order-label']} d-flex justify-content-end`}>
							<label htmlFor="order-total">小計:</label>
							<div className="d-flex flex-row gap-2">
								<span>NT$</span>
								<del id="order-total" className={`${Styles['TIL-priceBox']} m-0`}>
									1794
								</del>
							</div>
						</div>

						<div className={`${Styles['order-label']} d-flex justify-content-end`}>
							<label htmlFor="discounted-total">折扣後金額:</label>
							<div className="d-flex flex-row gap-2">
								<span>NT$</span>
								<h3
									id="discounted-total"
									className={`${Styles['TIL-price-discounted']} ${Styles['TIL-priceBox']} m-0`}
								>
									1694
								</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
