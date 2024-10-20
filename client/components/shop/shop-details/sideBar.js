import React from 'react'
import styles from './sideBar.module.scss'
import Image from 'next/image'

export default function SideBar() {
  const circle = [
    '/photos/shop_logo/sugar_logo.png',
    '/photos/shop_logo/mpapa_logo.png',
    '/photos/shop_logo/SEASON_Artisan_Pâtissier_logo.jpg',
    '/photos/shop_logo/laviebonbon_logo.jpg',
    '/photos/shop_logo/Gustave_Henri_logo.jpg',
  ]

  const getSize = (i) => ({
    width: i === 2 ? 200 : 120,
    height: i === 2 ? 200 : 120,
  })
  return (
    <>
      <div className={styles['TIL-sideBar']}>
        <div className={styles['TIL-sideBox']}>
          {circle.map((v, i) => {
            const { width, height } = getSize(i)
            return (
              <div key={i} className={styles['TIL-sideBarCircle']}>
                <Image
                  src={v}
                  alt={`Logo ${i + 1}`}
                  width={width}
                  height={height}
                  className={styles['TIL-sideBarImage']}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
