import React from 'react'
import SideBar from '@/components/shop/shop-details/sideBar'
import StoreDetails from '@/components/shop/shop-details'
import styles from '@/styles/shopDetail.module.scss'
import Header from '@/components/header'

export default function StoreDetail() {
  return (
    <>
      <Header />
      <div className={styles['TIL-storeDetailALL']}>
        <div className={styles['SideBar']}>
          <SideBar />
        </div>
        <div className={styles['StoreDetails']}>
          <StoreDetails />
        </div>
      </div>
    </>
  )
}
