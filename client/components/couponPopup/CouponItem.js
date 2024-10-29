import React from 'react';
import styles from './style.module.scss';

// 優惠券項目組件
const CouponItem = ({ discount, title, date }) => {
    const handleClaim = () => {
        // 處理領取優惠券的邏輯，暫時先放console.log
        console.log(`領取優惠券：${title}`);
      };
  return (
    <div className={styles['popup-coupon-item']}>
      <div className={styles['popup-coupon-discount']}>{discount}</div>
      <div className={styles['popup-coupon-item-content']}>
        <div className={styles['popup-coupon-details']}>
          <h2>{title}</h2>
          <span className={styles['date']}>DATE: {date}</span>
        </div>
        <button onClick={handleClaim}>點我領取</button>
      </div>
    </div>
  );
};

export default CouponItem;