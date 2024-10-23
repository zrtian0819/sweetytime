import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from "./photoFrame.module.scss"

export default function PhotoFrams({width=100,height=100,src=""}) {

  return (
    <>
      <div className={`outerFrame ${styles['outerFrame']}`}>
        <div className={`innerFrame ${styles['innerFrame']}`}>
            <div className={`${styles['photo']}`}>
                <Image src={src} width={0} height={0} alt="沒放照片餒"/>
            </div>
        </div>

        <div className={`${styles['scar']} ${styles['scar1']}`}></div>
        <div className={`${styles['scar']} ${styles['scar2']}`}></div>
        <div className={`${styles['scar']} ${styles['scar3']}`}></div>
        <div className={`${styles['scar']} ${styles['scar4']}`}></div>
      </div>

      <style jsx>
        {`
            .outerFrame{
                width:${width}px;
                height:${height}px;
            }
        `}
      </style>
    </>
  )
}
