import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Index() {
  const store = {
    name: 'SEASON Artisan Pâtissier敦南旗艦店',
    phone: '02-27085299',
    address: '台北市大安區敦化南路一段295巷16號1樓',
    description:
      'SEASON Artisan Pâtissier於2011年8月品牌誕生,在台北大直豪宅靜巷中發跡,也是甜點市場中人氣居高不墜的話題品牌,全台唯一提供多款現做盤式甜點的甜點概念餐廳,以獨特的個性和精緻的產品廣受媒體和美食同好熱愛推崇',
    logo_path: '/photos/shop_logo/SEASON_Artisan_Pâtissier_logo.jpg',
  };

  const ProductImg = [
    '/photos/products/15_cheesemate_choco_berry.jpg',
    '/photos/products/15_chizUp_passion.jpg',
    '/photos/products/15_cupostory_tart_cheese.jpg',
    '/photos/products/15_laydown_cheese_oreo.jpg',
    '/photos/products/15_souvenir_cake_matcha.jpg',
  ];

  const [imgSize, setImgSize] = React.useState(300);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 375) {
        setImgSize(150); // 手機尺寸
      } else {
        setImgSize(300); // 桌面尺寸
      }
    };

    // 初始檢查
    handleResize();

    // 監聽窗口變化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className={styles['TIL-Information-All']}>
        <div className={styles['TIL-store-Information']}>
          <div className={styles['TIL-store-left']}>
            <h1>{store.name}</h1>
            <div className={styles['TIL-store-text']}>
              <div className={styles['TIL-store-subtitle']}>
                <h3>聯絡電話：</h3>
              </div>
              <div className={styles['TIL-store-content']}>
                <p>{store.phone}</p>
              </div>
            </div>
            <div className={styles['TIL-store-text']}>
              <div className={styles['TIL-store-subtitle']}>
                <h3>商家地址：</h3>
              </div>
              <div className={styles['TIL-store-content']}>
                <p>{store.address}</p>
              </div>
            </div>
            <div className={styles['TIL-store-text']}>
              <div className={styles['TIL-store-subtitle']}>
                <h3>關於我們：</h3>
              </div>
              <div className={styles['TIL-store-content']}>
                <p>{store.description}</p>
              </div>
            </div>
          </div>
          <div className={styles['TIL-store-right']}>
            <Image
              src={store.logo_path}
              alt={store.name}
              width={imgSize}
              height={imgSize}
            />
          </div>
        </div>

        <div className={styles['TIL-Featured-Products']}>
          <h2>精選商品</h2>
          <div className={styles['TIL-carousel']}>
            {ProductImg.map((img, i) => {
              const radius = 250; // 圓的半徑
              const angleOffset = 360 / ProductImg.length; // 每張圖的角度偏移量
              const angle = i * angleOffset - 90;
              const x = radius * Math.cos((angle * Math.PI) / 180);
              const y = radius * Math.sin((angle * Math.PI) / 180);

              return (
                <div
                  key={i}
                  className={styles['TIL-carousel-item']}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <Image
                    src={img}
                    alt={`Image ${i}`}
                    width={220}
                    height={220}
                  />
                </div>
              );
            })}
          </div>
          <div
            id="TIL-prev"
            className={`${styles['TIL-carousel-prev']} ${styles['TIL-arrow']}`}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="3x" />
          </div>
          <div
            id="TIL-next"
            className={`${styles['TIL-carousel-next']} ${styles['TIL-arrow']}`}
          >
            <FontAwesomeIcon icon={faArrowRight} size="3x" />
          </div>

          <div className={styles['TIL-item-text']}>
            <h1>Product Name 1</h1>
            <div className={styles['des']}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
              maiores natus aut corrupti tempore fuga commodi corporis ullam,
              vel vero reiciendis facilis, voluptatum amet similique praesentium
              assumenda soluta perspiciatis modi. Non necessitatibus eius
              ducimus beatae dolore enim, incidunt at placeat et vero ratione,
              earum praesentium cumque neque voluptatum aspernatur dolorum
              blanditiis quo, corrupti nostrum aliquid qui. Et debitis qui
              exercitationem!
            </div>
            <button className={`${styles['TIL-btn']} btn btn-primary`}>
              來去逛逛
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
