import React from 'react';
import Styles from '@/components/purchase-card/purchase.module.scss';
import Window from './window';

export default function Purchase({ orderData }) {
  // 如果沒有傳入訂單資料，返回 null
  if (!orderData) return null;

  return (
    <div className={`${Styles['TIL-Details']} p-3 d-flex flex-column`}>
      <p className="text-stard my-auto">
        訂單編號: <span>{orderData.id}</span>
      </p>
      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-end">
          <Window />
        </div>
        <div className="d-flex flex-sm-row flex-column-reverse justify-content-between">
          <div className="mt-2">
            <h4 className="m-0">備註:</h4>
            <h4 className="my-auto" style={{ color: '#7caec8' }}>
              已使用的優惠：
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {orderData.coupon_id ? `優惠券 ID: ${orderData.coupon_id}` : '未使用優惠'}
              </span>
            </h4>
          </div>

          <div className="d-flex flex-column justify-content-center align-items-start align-items-sm-end">
            <div className={`${Styles['order-label']} d-flex justify-content-end`}>
              <label htmlFor="order-total">小計:</label>
              <div className="d-flex flex-row gap-2">
                <span>NT$</span>
                <del id="order-total" className={`${Styles['TIL-priceBox']} m-0`}>
                  {orderData.total_price || 0}
                </del>
              </div>
            </div>

            <div className={`${Styles['order-label']} d-flex justify-content-end`}>
              <label htmlFor="discounted-total">折扣後金額:</label>
              <div className="d-flex flex-row gap-2">
                <span>NT$</span>
                <h3
                  id="discounted-total"
                  className={`${Styles['TIL-price-discounted']} ${Styles['TIL-priceBox']} m-0`}
                >
                  {orderData.total_price || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}