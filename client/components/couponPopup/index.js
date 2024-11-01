import React from 'react';
import styles from './style.module.scss';
import CouponItem from '../coupon/CouponItem'; // 引入新組件

// 優惠券數據
const couponData = [
  {
    id: "XMAS2024",
    title: "白色聖誕月優惠券",
    description: "聖誕節特製甜點限定優惠",
    type: "PERCENT",
    discount: 10,
    minimumSpend: 1000,
    maximumDiscount: 500,
    status: "AVAILABLE",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    showClaimButton: true,
    termsAndConditions: [
      "限量發行1000份",
      "每人限領一次",
      "不可與其他優惠同時使用",
      "特價商品除外"
    ]
  },
  {
    id: "NEWYEAR2025", 
    title: "新年限定優惠",
    description: "新年首購享優惠",
    type: "FIXED",
    discount: -200,
    minimumSpend: 1500,
    maximumDiscount: 200,
    status: "UPCOMING",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    showClaimButton: false,
    termsAndConditions: [
      "新會員首次購物可用",
      "每人限用一次",
      "不可與其他優惠同時使用"
    ]
  },
  {
    id: "VIP2024",
    title: "VIP會員專屬優惠",
    description: "VIP會員單筆消費滿額折抵",
    type: "PERCENT",
    discount: 15,
    minimumSpend: 2000,
    maximumDiscount: 1000,
    status: "AVAILABLE",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    showClaimButton: true,
    termsAndConditions: [
      "限VIP會員使用",
      "每人每月限用一次",
      "特價商品可使用"
    ]
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
                endDate={coupon.endDate}
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