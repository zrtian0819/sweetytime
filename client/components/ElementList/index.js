import React, { useState } from 'react';
import styles from './ElementList.module.scss';

const ElementList = () => {
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <h2 className="mb-4">樣式表</h2>
      <hr />
      <h4 className="mb-3">輸入框</h4>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">姓名</label>
        <input type="text" className={`${styles.formControlCustom} form-control`} id="name" placeholder="請輸入姓名" />
      </div>
      <hr />
      <h4 className="mb-4">輸入框和提交按鈕示例</h4>
      <div className="input-group mb-3">
        <input type="text" className={`${styles.formControlCustom} form-control`} placeholder="請輸入..." />
        <button className={`${styles.btnCustom} btn`} type="button">提交</button>
      </div>
      <hr />
      <h4 className="mb-3">文本區域</h4>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">留言</label>
        <textarea className={`${styles.textareaCustom} form-control`} id="message" rows="3" placeholder="請輸入留言"></textarea>
      </div>
      <hr />
      <h4 className="mb-3">下拉選單</h4>
      <div className="mb-3">
        <label htmlFor="country" className="form-label">國家</label>
        <select className={`${styles.formSelectCustom} form-select`} id="country">
          <option selected>請選擇國家</option>
          <option value="1">台灣</option>
          <option value="2">日本</option>
          <option value="3">韓國</option>
        </select>
      </div>
      <hr />
      <h4 className="mb-3">複選框</h4>
      <div className="mb-3 form-check">
        <input type="checkbox" className={`${styles.formCheckInput} form-check-input`} id="check1" />
        <label className={`${styles.formCheckLabel} form-check-label`} htmlFor="check1">選項 1</label>
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className={`${styles.formCheckInput} form-check-input`} id="check2" />
        <label className={`${styles.formCheckLabel} form-check-label`} htmlFor="check2">選項 2</label>
      </div>
      <hr />
      <h4 className="mb-3">單選框</h4>
      <div className="mb-3 form-check">
        <input type="radio" className={`${styles.formCheckInput} form-check-input`} id="radio1" name="radioGroup" />
        <label className={`${styles.formCheckLabel} form-check-label`} htmlFor="radio1">選項 A</label>
      </div>
      <div className="mb-3 form-check">
        <input type="radio" className={`${styles.formCheckInput} form-check-input`} id="radio2" name="radioGroup" />
        <label className={`${styles.formCheckLabel} form-check-label`} htmlFor="radio2">選項 B</label>
      </div>
      {/* 其餘內容保持不變 */}
    </div>
  );
};

export default ElementList;
