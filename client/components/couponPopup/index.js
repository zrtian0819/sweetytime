import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import CouponItem from '../coupon/CouponItem';
import CouponDetailModal from '@/components/CouponDetailModal';
import axios from 'axios';

// 彈出式領取優惠券視窗
const CouponPopup = ({ isOpen, onClose }) => {
	const [displayCount, setDisplayCount] = useState(3);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [coupons, setCoupons] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);


	useEffect(() => {
		const fetchCoupons = async () => {
		  if (!isOpen) return;
		  
		  setIsLoading(true);
		  setError(null);
		  
		  try {
			const response = await axios.get('http://localhost:3005/api/coupon');
			setCoupons(response.data);
		  } catch (error) {
			console.error('Error fetching coupons:', error);
			setError('無法載入優惠券資料');
		  } finally {
			setIsLoading(false);
		  }
		};
	
		fetchCoupons();
	  }, [isOpen]);

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
		<div className={styles['popup-overlay']}>
		<div className={styles['popup-container']}>
		  <button className={styles['close-button']} onClick={onClose}>
			×
		  </button>
		  <div className={styles['popup-content']}>
			<div className={styles['popup-coupon']}>
			  {isLoading ? (
				<div className={styles['loading']}>載入中...</div>
			  ) : error ? (
				<div className={styles['error']}>{error}</div>
			  ) : displayedCoupons.length === 0 ? (
				<div className={styles['no-coupons']}>目前沒有可用的優惠券</div>
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
