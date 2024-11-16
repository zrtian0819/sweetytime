// components/user/collection/CollectionCard.js
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import styles from './collectionCard.module.scss';
import useCollection from '@/hooks/useCollection';

export default function CollectionCard({ type, data, onRemove }) {
  const { isLiked, toggleLike } = useCollection(type, data.id, onRemove);

  const handleToggleLike = async () => {
    await toggleLike();
    if (!isLiked) {  // 當愛心被取消後
      onRemove(data.id);
    }
  };

  console.log('CollectionCard:', data);

  const renderContent = () => {
    switch(type) {
      case 'shop':
        return (
          <>
            <Image 
              src={`/photos/shop_logo/${data.logo_path}`}
              alt={data.name}
              width={150}
              height={100}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3 className={styles.title}>{data.name}</h3>
              <p>{data.description}</p>
            </div>
          </>
        );
      
        case 'product':
            return (
              <>
                <div className={styles.proImageWrapper}>
                  <Image 
                    src={`/photos/products/${data.img}`}
                    alt={data.name}
                    fill
                    className={styles.proImage}
                  />
                </div>
                <div className={styles.proContent}>
                  <h3 className={styles.proTitle}>{data.name}</h3>
                  <p className={styles.proPrice}>NT$ {data.price.toLocaleString()}</p>
                </div>
              </>
            );
      
      case 'lesson':
        return (
          <>
            <Image 
              src={`/photos/lesson/${data.img}`}
              alt={data.name}
              width={200}
              height={200}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3 className={styles.title}>{data.name}</h3>
              <p>{data.date}</p>
              <p className={styles.price}>NT$ {data.price}</p>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.card} data-type={type}>
      <Link href={`/${type}/${data.id}`}>
        <div className={styles.imageContainer}>
          {renderContent()}
          <button 
            className={styles.likeButton}
            onClick={(e) => {
              e.preventDefault();
              toggleLike();
            }}
          >
            <FaHeart 
              size={20} 
              color={isLiked ? '#fe6f67' : 'grey'} 
            />
          </button>
        </div>
      </Link>
    </div>
  );
}