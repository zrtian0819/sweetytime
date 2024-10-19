import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';
import StepBar from '@/components/cart/step-bar';
import CartBox from '@/components/cart/cart-box';
import Link from 'next/link';

export default function Checkout(props) {
  useEffect(() => {
    //取得資料庫或是localStorage當中的購物車物件陣列渲染在頁面中
  }, []);

  return (
    <>
      <Header />
      <div className={`${Styles['ZRT-cartBody']} `}>
        <div className="container-md d-flex justify-content-start align-items-center flex-column">
          <StepBar />

          <div className="d-flex flex-column w-100 mt-4">
            <div className={`${Styles['ZRT-checkoutArea']} container px-3`}>
              <div className="row">
                <div className="col-1 mb-2">ChizUp!</div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-8 d-flex flex-column">
                  <div className={Styles['ZRT-item']}>還沒完成的元件</div>
                  <div className={Styles['ZRT-item']}>還沒完成的元件</div>
                  <div className={Styles['ZRT-item']}>還沒完成的元件</div>
                  <div className={Styles['ZRT-item']}>還沒完成的元件</div>
                  <hr />
                  <div className="d-flex justify-content-end mb-2">
                    小計<del>NT${'12,000'}</del>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>已使用的優惠: {'???'}</span>
                    <span>折扣後金額 NT${'11,999'}</span>
                  </div>
                </div>
                <div className="col-12 col-lg-4 mt-3 mt-lg-0 py-4">
                  <h4 className="fw-bold">運送方式</h4>
                  <select name="" id="" className="form form-control">
                    <option value="1">7-11 超商取貨</option>
                  </select>

                  <br />
                  <h4 className="fw-bold">收件資訊</h4>
                  <h5 className="name">王曉明</h5>
                  <h5 className="phone">0912341234</h5>
                  <h5 className="phone">
                    (速達門市) 320桃園市中壢區新生路二段378之2號
                  </h5>
                  <br />
                  <h5 className="editShipInfo d-flex justify-content-end">
                    編輯送貨資訊
                  </h5>

                  <br />
                  <h4 className="fw-bold">備註</h4>
                  <textarea
                    name=""
                    id=""
                    className="form form-control"
                  ></textarea>
                </div>
              </div>
            </div>
            <div
              className={`${Styles['ZRT-total']} d-flex justify-content-between align-items-center`}
            >
              <span>已選擇{4}件商品</span>
              <span>
                <span className="me-4">總計 NT${11999}</span>
                <Link className="ZRT-btn btn-lpnk" href="/cart/checkout">
                  確認付款
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
