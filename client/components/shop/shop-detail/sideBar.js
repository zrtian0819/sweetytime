import React from 'react'
import styles from './sideBar.module.scss'

export default function SideBar() {
  const circle = [
    '/photos/shop_logo/sugar_logo.png',
    '/photos/shop_logo/mpapa_logo.png',
    '/photos/shop_logo/SEASON_Artisan_Pâtissier_logo.jpg',
    '/photos/shop_logo/laviebonbon_logo.jpg',
    '/photos/shop_logo/Gustave_Henri_logo.jpg',
  ]

  return (
    <>
      <div className={styles['TIL-sideBar']}>
        <div className={styles['TIL-sideBox']}>
          {circle.map((v, i) => {
            return (
              <div key={i} className={styles['TIL-sideBarCircle']}>
                <img src={v}  alt={`Logo ${i + 1}`} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
