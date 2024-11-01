import React from 'react';
import styles from './CouponDetailModal.module.scss';

export default function CouponDetailModal({ coupon, isOpen, onClose }) {
  if (!coupon || !isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div className={styles.modalHeader}>
          <h2>{coupon.title}</h2>
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
              <span>{coupon.endDate}</span>
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
        </div>
      </div>
    </div>
  );
}