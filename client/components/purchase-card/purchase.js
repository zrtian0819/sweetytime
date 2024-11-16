import React from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Window from './window';

export default function Purchase({ orderData }) {
	console.log('Purchase orderData:', orderData);
	// 如果沒有傳入訂單資料，返回 null
	if (!orderData) return null;

	// 計算訂單項目的總金額
	const calculateSubtotal = () => {
		if (!orderData.items || orderData.items.length === 0) return 0;

		return orderData.items.reduce((sum, item) => {
			return sum + (Number(item.that_time_price) || 0);
		}, 0);
	};

	// 計算折扣了多少錢
	const calculateDiscount = () => {
		return calculateSubtotal() - Number(orderData.total_price);
	};

	// 計算total_price加上ship_pay
	const allSubtotal = () => {
		return Number(orderData.total_price) + Number(orderData.ship_pay);
	};

	const getStatusBadgeClass = (status) => {
		switch (status) {
			case '運送中':
				return 'bg-info';
			case '進行中':
				return 'bg-warning';
			case '已完成':
				return 'bg-success';
			default:
				return 'bg-secondary';
		}
	};

	return (
		<div className={`${Styles['TIL-Details']} p-3 d-flex flex-column`}>
			<div className="d-flex justify-content-between">
				<p className="text-stard my-auto">
					訂單編號: <span>{orderData.id}</span>
				</p>
				<Window orderData={orderData} />
			</div>
			{/* 店家名稱 */}
			<p className="text-stard mt-2 my-auto h5">
				店家名稱: <span>{orderData.shop_name}</span>
			</p>
			<div className="border-bottom py-3 mb-0">
				訂單狀態：
				<span
					className={`badge ${getStatusBadgeClass(orderData.status)} ms-2 px-3 py-2`}
					style={{ fontSize: '1rem' }}
				>
					{orderData.status}
				</span>
			</div>
			<div className="d-flex flex-column justify-content-between">
				<div className="d-flex flex-sm-row flex-column justify-content-between">
					<div className="mt-2">
						<h4 className="m-0">備註:</h4>
						<h4 className="my-auto" style={{ color: '#7caec8' }}>
							已使用的優惠：
							<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
								{orderData.coupon_id ? orderData.coupon_name : '未使用優惠'}
							</span>
						</h4>
					</div>

					<div className="d-flex flex-column justify-content-center align-items-start align-items-sm-end text-center">
						<div className={`${Styles['order-label']} d-flex justify-content-end`}>
							<label htmlFor="discounted-total">總金額:</label>
							<div className="d-flex flex-row gap-2">
								<span>NT$</span>
								<h3
									id="discounted-total"
									className={`${Styles['TIL-price-discounted']} ${Styles['TIL-priceBox']} m-0`}
								>
									{allSubtotal() || 0}
								</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
