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
        <div className={styles['popup-coupon-item-left']}>
            <div className={styles['popup-coupon-item-content-up']}>{title}</div>
            <div className={styles['popup-coupon-item-content-down']}>
                <div className={styles['popup-coupon-item-content-down-left']}>
                    {/* 這裡背景放圖片 */}
                </div>
                <div className={styles['popup-coupon-details']}>
                    <h2>{discount}  折</h2>
                    <hr />
                    <span className={styles['date']}>Expire Date: {date}</span>
                </div>
            </div>
            
        </div>
        <div className={styles['popup-coupon-item-right']}>
            <div className={styles['popup-coupon-item-content-up']}>
                <a>EST 2024</a>
                <span>甜覓食光</span>
                <a>Sweet time</a>
            </div>
            <div className={styles['popup-coupon-getCoupon']}>
                <button onClick={handleClaim}>點我領取</button>
            </div>
        </div>


      {/* <div className={styles['popup-coupon-discount']}>{discount}</div>
      <div className={styles['popup-coupon-item-content']}>
        <div className={styles['popup-coupon-details']}>
          <h2>{title}</h2>
          <span className={styles['date']}>DATE: {date}</span>
        </div>
        <button onClick={handleClaim}>點我領取</button>
      </div> */}
    </div>
  );
};

export default CouponItem;