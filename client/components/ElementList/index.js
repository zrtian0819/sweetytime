import React, { useState } from 'react';
import styles from './ElementList.module.scss';
import Button from '@/components/adminButton';
import UploadImage from '@/components/adminUpload';
import AdminTab from '@/components/adminTab';
import Modal from '@/components/adminModal';
import ViewButton from '@/components/adminCRUD/viewButton';
import EditButton from '@/components/adminCRUD/editButton';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import SearchBar from '@/components/adminSearch'; 

const ElementList = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isToggled, setIsToggled] = useState(false);

  const handleFileUpload = (file) => {
    console.log('選擇的文件:', file);
  };

  const handleToggleClick = () => {
    setIsToggled(!isToggled);
    console.log('Toggle狀態:', isToggled ? '關閉' : '開啟');
  };

  // 定義標籤頁的資料
  const tabs = [
    { key: 'home', label: 'Home', content: '這是 Home 標籤的內容' },
    { key: 'profile', label: 'Profile', content: '這是 Profile 標籤的內容' },
  ];

  const handleSearch = () => {
    console.log('搜尋按鈕被點擊');
  };

  return (
  
    <div className={styles.container}>
      <h2 className="mb-4">元件表 </h2>
    <p>歡迎至components資料夾找到Elements List參考引入元件方式，編輯頁可至pages/admin/editTeacher.js參考阿蘇使用的materia UI</p>
      <hr />

      {/* 按鈕 */}
      <h4 className="mb-3">按鈕</h4>
      <Button text="點擊我" onClick={() => console.log('點擊我按鈕被點擊')} />
      <hr />

      {/* 彈出框 */}
      <h4 className="mb-3">彈出框</h4>
      <Button text="打開彈出框" onClick={() => setShowModal(true)} />
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="彈出框標題"
        confirmText="保存更改"
        onConfirm={() => {
          console.log('保存更改');
          setShowModal(false);
        }}
      >
        <p>這是彈出框的內容</p>
      </Modal>
      <hr />

      {/* 標籤頁 */}
      <h4 className="mb-3">標籤頁</h4>
      <AdminTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <hr />

      {/* 上傳圖片 */}
      <h4 className="mb-3">上傳圖片</h4>
      <UploadImage onFileUpload={handleFileUpload} />
      <hr />

      {/* 操作按鈕示例 */}
      <h4 className="mb-3">操作按鈕</h4>
      <div className="d-flex gap-3">
        <ViewButton onClick={() => console.log('查看按鈕點擊')} />
        <EditButton onClick={() => console.log('編輯按鈕點擊')} />
        <ToggleButton onClick={handleToggleClick} isActive={isToggled} />
      </div>
      <hr />

      {/* 搜尋欄 */}
      <h4 className="mb-3">搜尋欄</h4>
      <SearchBar onSearch={handleSearch} />
      <hr />
				</div>
  );
};

export default ElementList;