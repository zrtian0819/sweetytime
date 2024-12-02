import React, { useState, useEffect, use } from 'react';
import styles from './style.module.scss';
import CouponItem from '../coupon/CouponItem';
import CouponDetailModal from '@/components/CouponDetailModal';
import { FaArrowDown } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '@/context/userContext';

// 彈出式領取優惠券視窗
const CouponPopup = ({ isOpen, onClose }) => {
	const [displayCount, setDisplayCount] = useState(3);
	// const [selectedCoupon, setSelectedCoupon] = useState(null);
	// const [showModal, setShowModal] = useState(false);
	const [coupons, setCoupons] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const { user } = useUser(); //匯入使用者
	let user_id;

	//頁面一載入時就初始化所有優惠券(並非等到點擊後才載入)
	useEffect(() => {
		//確認登入者user
		if (user) {
			user_id = user.id;
			// console.log(`✅優惠券: 您現在檢視的是${user_id}的優惠券`);

			//獲得該用戶的所有優惠券
			(async () => {
				try {
					const getHisCoupons = await axios.get(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupon/home-my-coupons`
					);
					const userCoupons = getHisCoupons.data;

					console.log('取得使用者的所有coupon', userCoupons);

					//用戶未領取的優惠券
					let NotGottenUserCoupon = userCoupons.filter(
						(cp) =>
							cp.user_collected == 0 &&
							!cp.used_time &&
							!isExpired(cp.end_date) &&
							cp.activation == 1
					);

					setCoupons(NotGottenUserCoupon);
					// console.log('userCoupons:', userCoupons);
					// console.log(NotGottenUserCoupon);
				} catch (e) {
					setError('優惠券資料載入錯誤:', e.message);
				}
			})();
		} else {
			//沒有登入則獲得所有優惠券
			(async () => {
				try {
					const getHisCoupons = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupon`);
					const Coupons = getHisCoupons.data;

					//篩選未過期且未被停用
					const validCoupon = Coupons.filter(
						(cp) => !isExpired(cp.end_date) && cp.activation == 1
					);
					console.log('目前平台可用的所有優惠券', validCoupon);
					setCoupons(validCoupon);
				} catch (e) {
					setError('優惠券資料載入錯誤:', e.message);
				}
			})();
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className={`${styles['popup-overlay']}`}>
			<div className={`${styles['popup-container']}`}>
				<button className={`${styles['close-button']} ZRT-click`} onClick={onClose}>
					×
				</button>
				<div className={styles['popup-content']}>
					<div className={styles['popup-coupon']}>
						{coupons && coupons.length > 0 ? (
							coupons.map((coupon, index) => (
								<div key={coupon.id || index} style={{ cursor: 'pointer' }}>
									<CouponItem
										discount_rate={coupon.discount_rate}
										name={coupon.name}
										end_date={coupon.end_date}
										showClaimButton={coupon.status === 'AVAILABLE'}
										status={coupon.status}
										allInfo={coupon}
									/>
								</div>
							))
						) : (
							<div className="h-100 text-secondary d-flex justify-content-center align-items-center">
								<h3 className="fw-bold">沒有可領取的優惠券😥</h3>
							</div>
						)}
					</div>

					{coupons.length > 4 && <FaArrowDown className={styles['remiderArrow']} />}
				</div>
			</div>
		</div>
	);
};

export default CouponPopup;

//判定是否過期
function isExpired(endDate) {
	const today = new Date();
	const end = new Date(endDate);
	return today > end;
}
