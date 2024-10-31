import React from 'react';
import styles from './style.module.scss';
import CouponItem from '../coupon/CouponItem'; // 引入新組件

// 優惠券數據
const couponData = [
  {
    discount: '9',
    title: '白色聖誕月優惠券',
    date: '2024/12/01'
  }
  ,
  {
    discount: '6.5',
    title: '新春納福感恩回饋',
    date: '2025/01/20'
  }
  ,
  {
    discount: '8.5',
    title: '萬聖甜點趴',
    date: '2024/12/01'
  }
];

// 彈出式領取優惠券視窗
const CouponPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles['popup-overlay']}>
      <div className={styles['popup-container']}>
        <button
          className={styles['close-button']}
          onClick={onClose}
        >
          ×
        </button>
        <div className={styles['popup-content']}>
          <div className={styles['popup-coupon']}>
            {/* 使用 map 渲染優惠券列表 */}
            {couponData.map((coupon, index) => (
              <CouponItem
                key={index}
                discount={coupon.discount}
                title={coupon.title}
                date={coupon.date}
              />
            ))}
          </div>
          <div className={styles['view-more']}>查看更多</div>
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;