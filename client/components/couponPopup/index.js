import React, { useState, useEffect, use } from 'react';
import styles from './style.module.scss';
import CouponItem from '../coupon/CouponItem';
import CouponDetailModal from '@/components/CouponDetailModal';
import axios from 'axios';
import { useUser } from '@/context/userContext';

// 彈出式領取優惠券視窗
const CouponPopup = ({ isOpen, onClose }) => {
	const [displayCount, setDisplayCount] = useState(3);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [coupons, setCoupons] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const { user } = useUser(); //匯入使用者
	let user_id;

	//頁面一載入時就初始化所有優惠券(並非等到點擊後才載入)
	useEffect(() => {
		//確認登入者user
		if (user) {
			user_id = user.id;
			console.log(`✅優惠券: 您現在檢視的是${user_id}的優惠券`);

			//獲得該用戶的所有優惠券
			(async () => {
				try {
					const getHisCoupons = await axios.get(
						'http://localhost:3005/api/coupon/my-coupons'
					);
					const userCoupons = getHisCoupons.data;

					//用戶未領取的優惠券
					let NotGottenUserCoupon = userCoupons.filter((cp) => cp.user_collected == 0);
					setCoupons(NotGottenUserCoupon);
					// console.log(userCoupons);
					// console.log(NotGottenUserCoupon);
				} catch (e) {
					setError('優惠券資料載入錯誤:', e.message);
				}
			})();
		} else {
			//沒有登入則獲得所有優惠券
			(async () => {
				try {
					const getHisCoupons = await axios.get('http://localhost:3005/api/coupon');
					const Coupons = getHisCoupons.data;
					console.log('獲取所有優惠券', Coupons);
					setCoupons(Coupons);
				} catch (e) {
					setError('優惠券資料載入錯誤:', e.message);
				}
			})();
		}
	}, []);

	// useEffect(() => {
	// 	const fetchCoupons = async () => {
	// 		if (!isOpen) return;

	// 		setIsLoading(true);
	// 		setError(null);

	// 		try {
	// 			const response = await axios.get('http://localhost:3005/api/coupon');
	// 			// console.log('coupon res:', response);
	// 			setCoupons(response.data);
	// 		} catch (error) {
	// 			console.error('Error fetching coupons:', error);
	// 			setError('無法載入優惠券資料');
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};

	// 	fetchCoupons();
	// }, [isOpen]);

	if (!isOpen) return null;

	const displayedCoupons = coupons.slice(0, displayCount);
	const hasMoreCoupons = coupons.length > displayCount;

	// 處理優惠券點擊
	const handleCouponClick = (coupon) => {
		setSelectedCoupon(coupon);
		setShowModal(true);
	};

	const handleLoadMore = () => {
		setDisplayCount(coupons.length);
	};

	return (
		<div className={`${styles['popup-overlay']}`}>
			<div className={styles['popup-container']}>
				<button className={`${styles['close-button']} ZRT-click`} onClick={onClose}>
					×
				</button>
				<div className={styles['popup-content']}>
					<div className={styles['popup-coupon']}>
						{isLoading ? (
							<div className={styles['loading']}>載入中...</div>
						) : error ? (
							<div className={styles['error']}>{error}</div>
						) : displayedCoupons.length === 0 ? (
							<div className={styles['no-coupons']}>目前沒有可領取的優惠券</div>
						) : (
							displayedCoupons.map((coupon, index) => (
								<div
									key={coupon.id || index}
									onClick={() => handleCouponClick(coupon)}
									style={{ cursor: 'pointer' }}
								>
									<CouponItem
										discount_rate={coupon.discount_rate}
										name={coupon.name}
										end_date={coupon.end_date}
										showClaimButton={coupon.status === 'AVAILABLE'}
										status={coupon.status}
									/>
								</div>
							))
						)}
					</div>
					{!isLoading && !error && hasMoreCoupons && (
						<div className={styles['view-more']} onClick={handleLoadMore}>
							查看更多
						</div>
					)}
				</div>
			</div>
			<CouponDetailModal
				coupon={selectedCoupon}
				isOpen={showModal}
				onClose={() => setShowModal(false)}
			/>
		</div>
	);
};

export default CouponPopup;
