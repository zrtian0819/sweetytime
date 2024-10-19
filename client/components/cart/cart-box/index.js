import React, { useState, useEffect } from 'react';
import Styles from './cart-box.module.scss';
import CartItem from '../cart-item';

export default function cartBox({ products }) {
  return (
    <div className={Styles['ZRT-cartBox']}>
      <CartItem />
    </div>
  );
}
