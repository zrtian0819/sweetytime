import React, { useState } from 'react';
import styles from './ElementList.module.scss';

const ElementList = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  return (
    <div className={styles.container}>
      <h2 className="mb-4">樣式表</h2>
      <hr />

      {/* 輸入框 */}
      <h4 className="mb-3">輸入框</h4>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">姓名</label>
        <input type="text" className={`${styles.formControlCustom} form-control`} id="name" placeholder="請輸入姓名" />
      </div>
      <hr />

      {/* 輸入框和提交按鈕示例 */}
      <h4 className="mb-4">輸入框和提交按鈕示例</h4>
      <div className="input-group mb-3">
        <input type="text" className={`${styles.formControlCustom} form-control`} placeholder="請輸入..." />
        <button className={`${styles.btnCustom} btn`} type="button">提交</button>
      </div>
      <hr />

      {/* 文本區域 */}
      <h4 className="mb-3">文本區域</h4>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">留言</label>
        <textarea className={`${styles.textareaCustom} form-control`} id="message" rows="3" placeholder="請輸入留言"></textarea>
      </div>
      <hr />

      {/* 下拉選單 */}
      <h4 className="mb-3">下拉選單</h4>
      <div className="mb-3">
        <label htmlFor="country" className="form-label">國家</label>
        <select className={`${styles.formSelectCustom} form-select`} id="country">
          <option value="">請選擇國家</option>
          <option value="1">台灣</option>
          <option value="2">日本</option>
          <option value="3">韓國</option>
        </select>
      </div>
      <hr />

      {/* 複選框 */}
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

      {/* 單選框 */}
      <h4 className="mb-3">單選框</h4>
      <div className="mb-3 form-check">
        <input type="radio" className={`${styles.formCheckInput} form-check-input`} id="radio1" name="radioGroup" />
        <label className={`${styles.formCheckLabel} form-check-label`} htmlFor="radio1">選項 A</label>
      </div>
      <div className="mb-3 form-check">
        <input type="radio" className={`${styles.formCheckInput} form-check-input`} id="radio2" name="radioGroup" />
        <label className={`${styles.formCheckLabel} form-check-label`} htmlFor="radio2">選項 B</label>
      </div>
      <hr />

      {/* 按鈕 */}
      <h4 className="mb-3">按鈕</h4>
      <button className={`${styles.btnCustom} btn`}>點擊我</button>
      <hr />

      {/* Link */}
      <h4 className="mb-3">Link</h4>
      <a className={styles.linkCustom} href="#">這是一個 link</a>
      <hr />

      {/* 彈出框 */}
      <h4 className="mb-3">彈出框</h4>
      <button className={`${styles.btnCustom} btn`} onClick={() => setShowModal(true)}>打開彈出框</button>
      {showModal && (
        <div className={`modal fade show ${styles.modal}`} tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">彈出框標題</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">這是彈出框的內容</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>關閉</button>
                <button type="button" className={`${styles.btnCustom} btn`}>保存更改</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <hr />
 {/* 標籤頁 */}
 <h4 className="mb-3">標籤頁</h4>
      <div className={styles.navTabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'home' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'home' && (
          <div className={styles.tabPane}>
            這是 Home 標籤的內容
          </div>
        )}
        {activeTab === 'profile' && (
          <div className={styles.tabPane}>
            這是 Profile 標籤的內容
          </div>
        )}
      </div>
      <hr />

      {/* 上傳圖片 */}
      <h4 className="mb-3">上傳圖片</h4>
      <label htmlFor="fileUpload" className={styles.customFileUpload}>
        選擇圖片
        <input type="file" id="fileUpload" className={styles.fileInput} onChange={handleFileUpload} />
      </label>
    </div>
  );
};

export default ElementList;
