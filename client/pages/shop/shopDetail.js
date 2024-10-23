import React from 'react'
import SideBar from '@/components/shop/shop-detail/sideBar'
import ShopDetail from '@/components/shop/shop-detail'
import styles from '@/styles/shopDetail.module.scss'
import Header from '@/components/header'

export default function shopDetail() {
  return (
    <>
      <Header />
      <div className={styles['TIL-storeDetailALL']}>
        <div className={styles['SideBar']}>
          <SideBar />
        </div>
        <div className={styles['ShopDetail']}>
          <ShopDetail />
        </div>
      </div>
    </>
  )
}
