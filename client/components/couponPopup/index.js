import React, { useState } from 'react';
import styles from './style.module.scss';
import CouponItem from '../coupon/CouponItem';
import CouponDetailModal from '@/components/CouponDetailModal';
import axios from 'axios';

// 優惠券數據
const couponData = [
	{
		id: 'XMAS2024',
		name: '白色聖誕月優惠券',
		description: '聖誕節特製甜點限定優惠',
		type: 'PERCENT',
		discount: 10,
		minimumSpend: 1000,
		maximumDiscount: 500,
		status: 'AVAILABLE',
		start_time: '2024-12-01',
		end_time: '2024-12-31',
		termsAndConditions: [
			'限量發行1000份',
			'每人限領一次',
			'不可與其他優惠同時使用',
			'特價商品除外',
		],
	},
	{
		id: 'VIP2024',
		name: 'VIP會員專屬優惠',
		description: 'VIP會員單筆消費滿額折抵',
		type: 'PERCENT',
		discount: 15,
		minimumSpend: 2000,
		maximumDiscount: 1000,
		status: 'AVAILABLE',
		start_time: '2024-11-01',
		end_time: '2024-12-31',
		termsAndConditions: ['限VIP會員使用', '每人每月限用一次', '特價商品可使用'],
	},
	{
		id: 'XMAS2024',
		name: '白色聖誕月優惠券',
		description: '聖誕節特製甜點限定優惠',
		type: 'PERCENT',
		discount: 10,
		minimumSpend: 1000,
		maximumDiscount: 500,
		status: 'AVAILABLE',
		start_time: '2024-12-01',
		end_time: '2024-12-31',
		termsAndConditions: [
			'限量發行1000份',
			'每人限領一次',
			'不可與其他優惠同時使用',
			'特價商品除外',
		],
	},
	{
		id: 'VIP2024',
		name: 'VIP會員專屬優惠',
		description: 'VIP會員單筆消費滿額折抵',
		type: 'PERCENT',
		discount: 15,
		minimumSpend: 2000,
		maximumDiscount: 1000,
		status: 'AVAILABLE',
		start_time: '2024-11-01',
		end_time: '2024-12-31',
		termsAndConditions: ['限VIP會員使用', '每人每月限用一次', '特價商品可使用'],
	},
];

// 彈出式領取優惠券視窗
const CouponPopup = ({ isOpen, onClose }) => {
	const [displayCount, setDisplayCount] = useState(3);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showModal, setShowModal] = useState(false);

	if (!isOpen) return null;

	const displayedCoupons = couponData.slice(0, displayCount);
	const hasMoreCoupons = couponData.length > displayCount;

	// 處理優惠券點擊
	const handleCouponClick = (coupon) => {
		setSelectedCoupon(coupon);
		setShowModal(true);
	};

	const handleLoadMore = () => {
		setDisplayCount(couponData.length);
	};

	return (
		<div className={styles['popup-overlay']}>
			<div className={styles['popup-container']}>
				<button className={styles['close-button']} onClick={onClose}>
					×
				</button>
				<div className={styles['popup-content']}>
					<div className={styles['popup-coupon']}>
						{/* 使用 map 渲染優惠券列表 */}
						{displayedCoupons.map((coupon, index) => (
							<div
								onClick={() => handleCouponClick(coupon)}
								style={{ cursor: 'pointer' }}
							>
								<CouponItem
									key={`${coupon.id}-${index}`}
									discount={coupon.discount}
									name={coupon.name}
									end_time={coupon.end_time}
									showClaimButton={coupon.status === 'AVAILABLE'}
									onClick={() => handleCouponClick(coupon)}
								/>
							</div>
						))}
					</div>
					{hasMoreCoupons && (
						<div className={styles['view-more']} onClick={handleLoadMore}>
							查看更多
						</div>
					)}
				</div>
			</div>
			{/* 彈出的優惠券詳情視窗 */}
			<CouponDetailModal
				coupon={selectedCoupon}
				isOpen={showModal}
				onClose={() => setShowModal(false)}
			/>
		</div>
	);
};

export default CouponPopup;
