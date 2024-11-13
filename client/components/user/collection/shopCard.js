import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import Styles from '@/components/user/collection/shopCard.module.scss';

export default function ShopCard({ shop, originalLiked, handleToggleLike }) {
  return (
    <div className={Styles['TIL-container']}>
      <div className={Styles['TIL-shopCard']}>
        <Link href={`/shop/${shop.id}`} className={Styles['TIL-content']}>
          <div className={Styles['TIL-Image-box']}>
            <Image
              src={`/photos/shop_logo/${shop.logo_path}`}
              alt={shop.name}
              width={120}
              height={120}
              className={Styles['TIL-Image']}
            />
          </div>
        </Link>
        <button className={Styles['TIL-FavoriteBox']} onClick={handleToggleLike}>
          <FaHeart size={20} color={originalLiked ? '#fe6f67' : 'grey'} />
        </button>
        <h4 className={Styles['TIL-shop-name']}>
          {shop.name}
        </h4>
      </div>
      <div className={Styles['TIL-description']}>
        {shop.description}
      </div>
    </div>
  );
}