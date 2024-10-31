import React, { useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';

const CouponItem = ({ discount, title, date, showClaimButton = true }) => { // 改名為更具體的 showClaimButton
    const [isClaimed, setIsClaimed] = useState(false);

    const handleClaim = () => {
        console.log(`領取優惠券：${title}`);
        setIsClaimed(true);
    };

    return (
        <div className={styles['popup-coupon-item']}>
            <div className={styles['popup-coupon-item-left']}>
                <div className={styles['popup-coupon-item-content-up']}>
                    {title}
                </div>
                <div className={styles['popup-coupon-item-content-down']}>
                    <div className={styles['popup-coupon-item-content-down-left']}>
                        <Image 
                            src="/vector/couponCake.svg" 
                            width={122} 
                            height={73} 
                            alt="Coupon cake"
                            className={styles['cake-image']}
                        />
                    </div>
                    <div className={styles['popup-coupon-details']}>
                        <h2>{discount} 折</h2>
                        <span className={styles['date']}>
                            Expire Date: {date}
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