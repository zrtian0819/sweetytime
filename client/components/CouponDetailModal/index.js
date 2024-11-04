import React from 'react';
import styles from './CouponDetailModal.module.scss';

export default function CouponDetailModal({ coupon, isOpen, onClose, onClaimCoupon }) {
	if (!coupon || !isOpen) return null;

	const handleClaimCoupon = (e) => {
		e.preventDefault();
		if (onClaimCoupon) {
			onClaimCoupon(coupon.id);
		}
	};

	  // 根據優惠券狀態渲染不同的按鈕
	  const renderActionButton = () => {
		switch (coupon.status) {
		  case 'AVAILABLE':
			return (
			  <button className={styles.claimButton} onClick={handleClaimCoupon}>
				領取優惠券
			  </button>
			);
		  case 'CLAIMED':
			return (
			  <button className={`${styles.claimButton} ${styles.claimed}`} disabled>
				已領取
			  </button>
			);
		  default:
			return null; // 其他狀態不顯示按鈕
		}
	  };

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>

				<div className={styles.modalHeader}>
					<h2>{coupon.name}</h2>
				</div>

				<div className={styles.modalBody}>
					<p className={styles.description}>{coupon.description}</p>

					<div className={styles.infoBox}>
						<div className={styles.infoRow}>
							<span>最低消費金額</span>
							<span>NT$ {coupon.minimumSpend}</span>
						</div>
						<div className={styles.infoRow}>
							<span>最高折抵金額</span>
							<span>NT$ {coupon.maximumDiscount}</span>
						</div>
						<div className={styles.infoRow}>
							<span>使用期限</span>
							<span>{coupon.start_time}~{coupon.end_time}</span>
						</div>
					</div>

					<div className={styles.terms}>
						<h3>使用條款與條件：</h3>
						<ul>
							{coupon.termsAndConditions.map((term, index) => (
								<li key={index}>{term}</li>
							))}
						</ul>
					</div>

					{renderActionButton()}
				</div>
			</div>
		</div>
	);
}
