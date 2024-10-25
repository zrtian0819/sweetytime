import React, { useState, useEffect } from 'react'
import sty from './pikaso.module.scss'  //引入style
import Image from 'next/image'

export default function Pikaso({text="title",src="/photos/pikaso/Pikaso1.png"}) {
  return (
    <div  className={`${sty.outter}`}>
      <div className={`${sty.box} ZRT-pikaso-box`}>
            <Image src={src} width={10} height={10} />
      </div>
      <p className={`${sty.text}`}>{text}</p>
    </div>
  )
}
