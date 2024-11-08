import React from 'react';
import Purchase from './purchase';

export default function PurchaseCard(props) {
  const {
    id,
	status,
	user_id,
	shop_id,
    coupon_id,
	payment,
	delivery,
	delivery_address,
	delivery_name,
	delivery_phone,
	note,
	order_time,
    total_price,
  } = props;

  const orderData = {
    id,
	status,
	user_id,
	shop_id,
    coupon_id,
	payment,
	delivery,
	delivery_address,
	delivery_name,
	delivery_phone,
	note,
	order_time,
    total_price,
  };

  return <Purchase orderData={orderData} />;
}