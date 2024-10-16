// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })
import Styles from '@/styles/home.module.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Home() {
  console.log(Styles['sec'])
  return (
    <>
      <Header />
      <div className={`${Styles['sec']} ${Styles['sec1']}`}></div>
      <div className={`${Styles['sec']} ${Styles['sec2']}`}></div>
      <div className={`${Styles['sec']} ${Styles['sec3']}`}></div>
      <div className={`${Styles['sec']} ${Styles['sec4']}`}></div>
      <Footer />
    </>
  )
}
