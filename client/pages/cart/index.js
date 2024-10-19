import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import CartBox from '@/components/cart/cart-box';

export default function Cart(props) {
  useEffect(() => {
    //取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
  }, []);

  return (
    <>
      <Header />
      <div className={`${Styles['ZRT-cartBody']}`}>
        <div className="container-md d-flex justify-content-start align-items-center flex-column">
          <StepBar />

          <div className="d-flex flex-column w-100 mt-4">
            <label>
              <input type="checkbox" />
              選擇全部
            </label>

            <div className={Styles['ZRT-cartArea']}>
              <label className={Styles['ZRT-shopName']}>
                <input type="checkbox" />
                <h4>Chizup!</h4>
              </label>

              <CartBox />
              <CartBox />
              <CartBox />
            </div>
            <div className={Styles['ZRT-cartArea']}>
              <label className={Styles['ZRT-shopName']}>
                <input type="checkbox" />
                <h4>Chizdown!</h4>
              </label>

              <CartBox />
            </div>

            <div className={Styles['ZRT-total']}>
              小計與前往結帳區塊正在製作中...
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
