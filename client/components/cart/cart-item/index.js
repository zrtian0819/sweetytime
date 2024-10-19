import React, { useState, useEffect } from 'react';
import Styles from './cart-item.module.scss';
import Image from 'next/image';

export default function CartItem(props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="d-flex flex-row justify-content-between align-items-center px-3 py-2">
      <input type="checkbox" />
      <Image
        src="/photos/products/00_ChizUp_cheesecake.jpg"
        height={120}
        width={120}
        alt="productImage"
      />
      <h4 className="name">方磚起司蛋糕</h4>
      <h4 className="price">$NT{'1000'}</h4>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
        }}
      />
      <div className="remove">❌</div>
    </div>
  );
}
