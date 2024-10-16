import React, { useState, useEffect } from 'react'
import Styles from './header.module.css'
import Link from 'next/link'
import Image from 'next/image'

// 功能還沒寫

export default function Header(props) {
  return (
    <header className={Styles['header']}>
      <Link href={''} className={Styles['Link']}>
        Products
      </Link>
      <Link href={''} className={Styles['Link']}>
        Shops
      </Link>
      <Link href={''} className={Styles['Link']}>
        Lessons
      </Link>
      <div className={Styles['halfCircle']}>
        <Image
          src={'/icon/sweet_time_logo1.png'}
          alt=""
          width={120}
          height={60}
        />
      </div>
      <Link href={''} className={Styles['Link']}>
        Teachers
      </Link>
      <Link href={''} className={Styles['Link']}>
        News
      </Link>
      <div className={Styles['icon']}>
        <Image src={'/icon/portrait.svg'} alt="" width={30} height={30} />
        <Image src={'/icon/cart.svg'} alt="" width={30} height={30} />
      </div>
    </header>
  )
}
