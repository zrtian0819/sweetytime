import React, { useState, useEffect } from 'react'
import styles from './product-card.module.scss'
import Image from 'next/image'

export default function ProductCard({
  src = '',
  name = '產品名稱',
  price = 200,
  discount = 1,
}) {
  return (
    <>
      <div className={styles['ProductCard']}>
        <div className={styles['imgBox']}>
          <div className={styles['heart']}>❤️</div>
          <Image
            src="/34_cupostory_tart_mushroom.jpg"
            alt={''}
            width={0}
            height={0}
          />
        </div>
        <div className={styles['textBox']}>
          <div className="detail">
            <div className={styles['productName']}>{name}</div>
            <div className="productPrice">
              $
              {discount === 1 ? (
                <span className={styles['price']}>{price}</span>
              ) : (
                <span>
                  <del>{price}</del>{' '}
                  <span className={styles['price']}>{price * discount}</span>
                </span>
              )}
            </div>
          </div>

          <button className="btn btn-pnk">加入購物車</button>
        </div>
      </div>
    </>
  )
}
