import React, { useState, useEffect } from 'react'
import sty from './pikaso.module.scss'  //引入style
import Image from 'next/image'

export default function Pikaso({text="title",src="/photos/pikaso/Pikaso1.png",bgc=""}) {

  if(!bgc) bgc = "linear-gradient(to bottom, #fe6f67, #fe6f67);"

  if(bgc=="1"){
    bgc = "linear-gradient(to bottom, #fe6f67, #fe6f67);"
  }else if(bgc=="2"){
    bgc = "linear-gradient(to right, #967AC6, #FCCFD6);"
  }else if(bgc=="3"){
    bgc = "linear-gradient(45deg, #3C57A4, #D24047);"
  }

  return (
    <>
    <div  className={`${sty.outter}`}>
      <div className={`${sty.box} ZRT-pikaso-box`}>
            <Image src={src} width={10} height={10} />
      </div>
      <p className={`${sty.text}`}>{text}</p>
    </div>

    <style jsx>
      {`
      .ZRT-pikaso-box{
          background: ${bgc};
      }
      `}

    </style>
    </>
  )
}
