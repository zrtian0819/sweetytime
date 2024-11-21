import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './product-card.module.scss';

export default function ProductCard({ product }) {
  const discountedPrice = (product.price * product.discount).toFixed(2);
  const hasDiscount = product.discount !== 1;
  
  return (
    <div className={styles['product-card']}>
      <Link href={`/product/${product.id}`} className={styles['product-link']}>
        <div className={styles['image-container']}>
          <Image
            src={`/photos/products/${product.img}`}
            alt={product.name}
            width={250}
            height={300}
            className={styles['product-image']}
            onError={(e) => {
              console.error('Image loading error:', e);
            }}
          />
          {hasDiscount && (
            <span className={styles['discount-badge']}>
              {Math.round((1 - product.discount) * 100)}% OFF
            </span>
          )}
          <button 
            className={styles['heart-button']}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            ❤️
          </button>
        </div>

        <div className={styles['product-info']}>
          <h3 className={styles['product-name']}>{product.name}</h3>
          <div className={styles['price-container']}>
            {hasDiscount && (
              <span className={styles['original-price']}>${product.price}</span>
            )}
            <span className={styles['current-price']}>
              ${hasDiscount ? discountedPrice : product.price}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}