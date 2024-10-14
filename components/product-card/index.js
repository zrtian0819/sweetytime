import React, { useState, useEffect } from 'react'
import styles from './product-card.module.css'
import Image from 'next/image'

export default function ProductCard({ src }) {
  return (
    <>
      <div className={styles['ProductCard']}>
        <div className={styles['imgBox']}>
          <Image
            src="/34_cupostory_tart_mushroom.jpg"
            alt={''}
            width={0}
            height={0}
          />
        </div>
        <div className={styles['textBox']}></div>
      </div>
    </>
  )
}
