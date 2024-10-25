import React, { useState, useEffect } from 'react';
import Styles from './footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

export default function Footer(props) {
  const [logoSrc, setLogoSrc] = useState('/icon/sweet_time_logo1.png');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleLogoChange = () => {
      setLogoSrc(mediaQuery.matches ? '/icon/sweet_time_logo1_white.png' : '/icon/sweet_time_logo1.png');
    };
    handleLogoChange(); // 初次渲染時設定logoSrc
    mediaQuery.addEventListener('change', handleLogoChange);
    return () => mediaQuery.removeEventListener('change', handleLogoChange);
  }, []);

  return (
    <>
      <div className={Styles['footer']}>
        <div className={Styles['mainDiv']}>
          <div className={Styles['logoDiv']}>
            <Link href={'/'}>
              <Image
                className={Styles['logo']}
                src={logoSrc}
                fill
                alt=""
              />
            </Link>
          </div>
          <div className={Styles['centerDiv']}>
            <div className={Styles['iconsDiv']}>
              <FontAwesomeIcon className={`${Styles['facebookIcon']} mx-3`} icon={faFacebook} />
              <FontAwesomeIcon className={`${Styles['commentIcon']} mx-3`} icon={faComment} />
              <FontAwesomeIcon className={`${Styles['instagramIcon']} mx-3`} icon={faInstagram} />
            </div>
            <h5 className={`${Styles['centerText']} text-center`}>If you have any question, please contact <span className={Styles['pink']}>sweetytime@gmail.com</span></h5>
          </div>
          <div className={Styles['rightDiv']}>
            <h4><Link href={'/'} className={Styles['link']}>About us</Link></h4>
            <h4><Link href={'/'} className={Styles['link']}>Contact us</Link></h4>
            <h4><Link href={'/'} className={Styles['link']}>Need some help?</Link></h4>
          </div>
        </div>
        <div className={Styles['rights']}>
          <h5>@ 2024 Sweety Time. All rights reserved.</h5>
        </div>
      </div>
    </>
  )
}
