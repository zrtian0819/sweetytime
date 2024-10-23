// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })
import Styles from '@/styles/home.module.scss'
import Header from '@/components/header'
import Footer from '@/components/footer'
import PhotoFrams from '@/components/photoFrame'

export default function Home() {
  console.log(Styles['sec'])
  return (
    <>
      <Header />
      <div className={`${Styles['sec']} ${Styles['sec1']}`}></div>
      <div className={`${Styles['sec']} ${Styles['sec2']}`}>
        <div className="container">
          <PhotoFrams width={180} height={300} src={"/photos/products/01_cheesemate_chesse.jpg"}/>
          <PhotoFrams width={200} height={150} src={"/photos/products/00_mpapa_moossecake_choco.jpg"}/>
          <PhotoFrams width={400} height={300} src={"/photos/products/05_aki_pudding_matcha.jpg"}/>
        </div>
      </div>
      <div className={`${Styles['sec']} ${Styles['sec3']}`}></div>
      <div className={`${Styles['sec']} ${Styles['sec4']}`}></div>
      <Footer />
    </>
  )
}
