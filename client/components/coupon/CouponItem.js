import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import { useUser } from '@/context/userContext';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import CouponDetailModal from '@/components/CouponDetailModal';
import axios from 'axios';

const CouponItem = ({
	discount_rate,
	name,
	end_date,
	showClaimButton,
	status,
	termsAndConditions,
	allInfo,
}) => {
	// console.log('Props:', { discount_rate, name, end_date, showClaimButton, status, termsAndConditions });
	const { user } = useUser();
	const router = useRouter();

	const [isClaimed, setIsClaimed] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const handleClaim = (cid) => {
		if (user) {
			const user_id = user.id;
			console.log(`user_id:${user_id} 領取了優惠券：${name}`);
			setIsClaimed(true);

			//將使用者的coupon設定為已領取
			try {
				(async () => {
					const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupon/get-coupon`, {
						userId: user_id,
						cpId: cid,
					});
					console.log('✅優惠券領取訊息:', res.data.message);
				})();
			} catch (e) {
				console.log(e.message);
			}
		} else {
			Swal.fire({
				title: '請先登入',
				icon: 'warning',
			});
			router.push('/login');
		}
	};

	// 根據 discount 值決定顯示格式
	const renderDiscount = () => {
		if (discount_rate > 0) {
			//大於0返回*10倍數，只顯示到小數點第一位
			return (
				<h2>
					{(discount_rate * 10).toFixed(1)} <span>折</span>
				</h2>
			);
		} else {
			return (
				<h2>
					-{Math.abs(discount_rate)}
					<span> $</span>
				</h2>
			);
		}
	};

	// 處理優惠券點擊
	const handleCouponClick = (coupon) => {
		if (coupon) {
			setSelectedCoupon(coupon);
			setShowModal(true);
		} else {
			console.log('❌請傳入一整個coupon物件');
		}
	};

	// 根據 status 決定顯示哪個蛋糕圖片
	const getCakeImage = () => {
		return status === 'EXPIRED' ? '/vector/couponCake_EXPIRED.svg' : '/vector/couponCake.svg';
	};

	return (
		<div
			className={`${styles['popup-coupon-item']} ${
				status === 'EXPIRED' ? styles['expired'] : ''
			}`}
		>
			<div
				className={styles['popup-coupon-item-left']}
				onClick={() => handleCouponClick(allInfo)}
			>
				<div className={styles['popup-coupon-item-content-up']}>{name}</div>
				<div className={styles['popup-coupon-item-content-down']}>
					<div className={styles['popup-coupon-item-content-down-left']}>
						<Image
							src={getCakeImage()}
							width={122}
							height={73}
							alt="Coupon cake"
							className={styles['cake-image']}
						/>
					</div>
					<div className={styles['popup-coupon-details']}>
						{renderDiscount()}
						<span className={styles['date']}>Expire Date: <br />{end_date}</span>
						<br />
					</div>
				</div>
			</div>
			<div className={styles['popup-coupon-item-right']}>
				<div className={styles['popup-coupon-item-content-up']}>
					<a>EST 2024</a>
					<span>甜覓食光</span>
					<a>Sweet time</a>
				</div>
				{showClaimButton && (
					<div className={styles['popup-coupon-getCoupon']}>
						<button
							onClick={() => {
								handleClaim(allInfo.coupon_id);
							}}
							className={isClaimed ? styles['claimed'] : ''}
							disabled={isClaimed}
						>
							{isClaimed ? '已領取' : '點我領取'}
						</button>
					</div>
				)}
			</div>
			<CouponDetailModal
				coupon={selectedCoupon}
				isOpen={showModal}
				onClose={() => setShowModal(false)}
			/>
		</div>
	);
};

export default CouponItem;
