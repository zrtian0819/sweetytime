import React, { useState, useEffect } from 'react';
import styles from '../couponPopup/style.module.scss';

// 彈出式領取優惠券視窗
const CouponPopup = ({ isOpen, onClose }) => {
	// 如果 isOpen 為 false，不渲染組件
	if (!isOpen) return null;
	return (
		<div className={styles['popup-overlay']}>
			<div className={styles['popup-container']}>
				<button
					className={styles['close-button']}
					onClick={onClose} // 使用傳入的 onClose 函數
				>
					×
				</button>
				<div className={styles['popup-content']}>
					<div className={styles['popup-coupon']}>
						<div className={styles['popup-coupon-item']}>
							<div className={styles['popup-coupon-discount']}>9折</div>
							<div className={styles['popup-coupon-item-content']}>
								<div className={styles['popup-coupon-details']}>
									<h2>白色聖誕月優惠券</h2>
									<span className={styles['date']}>DATE: 2024/12/01</span>
								</div>
								<button>點我領取</button>
							</div>
						</div>
						{/* 其他優惠券項目 */}
						<div className={styles['popup-coupon-item']}>
							<div className={styles['popup-coupon-discount']}>6.5折</div>
							<div className={styles['popup-coupon-item-content']}>
								<div className={styles['popup-coupon-details']}>
									<h2>新春納福感恩回饋</h2>
									<span className={styles['date']}>DATE: 2024/12/01</span>
								</div>
								<button>點我領取</button>
							</div>
						</div>
						<div className={styles['popup-coupon-item']}>
							<div className={styles['popup-coupon-discount']}>8.5折</div>
							<div className={styles['popup-coupon-item-content']}>
								<div className={styles['popup-coupon-details']}>
									<h2>萬乘甜點趴</h2>
									<span className={styles['date']}>DATE: 2024/12/01</span>
								</div>
								<button>點我領取</button>
							</div>
						</div>
					</div>
					<div className={styles['view-more']}>查看更多</div>
				</div>
			</div>
		</div>
	);
};

export default CouponPopup;
