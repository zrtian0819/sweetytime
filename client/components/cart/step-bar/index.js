import React, { useState, useEffect } from 'react';
import Styles from './step-bar.module.scss';

export default function StepBar({ step = 1 }) {
  return (
    <>
      <div className={Styles['ZRT-stepBar']}>
        <div
          className={`ZRT-btn rounded-pill ${
            step == 1 ? 'btn-pnk' : 'btn-gry'
          }`}
        >
          購物車
        </div>
        <div className={Styles['ZRT-bar']}></div>
        <div
          className={`ZRT-btn rounded-pill ${
            step == 2 ? 'btn-pnk' : 'btn-gry'
          }`}
        >
          結帳及付款資訊
        </div>
        <div className={Styles['ZRT-bar']}></div>
        <div
          className={`ZRT-btn rounded-pill ${
            step == 3 ? 'btn-pnk' : 'btn-gry'
          }`}
        >
          訂單明細
        </div>
      </div>
    </>
  );
}
