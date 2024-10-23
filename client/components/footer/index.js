import React, { useState, useEffect } from 'react';
import Styles from './footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

export default function Footer(props) {
  return (
    <>
      <div className={Styles['footer']}>
        <div className={Styles['mainDiv']}>
          <div>
            <Link href={'/'}>
              <Image
                className={Styles['logo']}
                src={'/icon/sweet_time_logo1.png'}
                alt=""
                width={140}
                height={75}
              />
            </Link>
          </div>
          <div className={Styles['centerDiv']}>
            <div className={Styles['iconsDiv']}>
              <FontAwesomeIcon className={Styles['facebookIcon']} icon={faFacebook} />
              <FontAwesomeIcon className={Styles['commentIcon']} icon={faComment} />
              <FontAwesomeIcon className={Styles['instagramIcon']} icon={faInstagram} />
            </div>
            <h5 className={Styles['centerText']}>If you have any question, please contact <span className={Styles['pink']}>sweetytime@gmail.com</span></h5>
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
