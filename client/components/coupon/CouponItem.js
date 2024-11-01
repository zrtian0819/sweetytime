import React, { useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';

const CouponItem = ({ discount, title, endDate, showClaimButton, status }) => {
    const [isClaimed, setIsClaimed] = useState(false);

    const handleClaim = () => {
        console.log(`領取優惠券：${title}`);
        setIsClaimed(true);
    };

    // 根據 discount 值決定顯示格式
    const renderDiscount = () => {
        if (discount > 0) {
            return <h2>-{discount} %</h2>;
        } else {
            return <h2>{Math.abs(discount)} $</h2>;
        }
    };

    // 根據 status 決定顯示哪個蛋糕圖片
    const getCakeImage = () => {
        return status === 'EXPIRED' ? '/vector/couponCake_EXPIRED.svg' : '/vector/couponCake.svg';
    };

    return (
        <div className={`${styles['popup-coupon-item']} ${status === 'EXPIRED' ? styles['expired'] : ''}`}>
            <div className={styles['popup-coupon-item-left']}>
                <div className={styles['popup-coupon-item-content-up']}>
                    {title}
                </div>
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
                        <span className={styles['date']}>
                            Expire Date: {endDate}
                        </span>
                        <hr />
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
                            onClick={handleClaim}
                            className={isClaimed ? styles['claimed'] : ''}
                            disabled={isClaimed}
                        >
                            {isClaimed ? '已領取' : '點我領取'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponItem;