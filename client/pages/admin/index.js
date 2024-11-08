// pages/admin/Index.js
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ElementList from '@/components/ElementList';
import UploadImage from '@/components/adminUpload'; // 引入 UploadImage 組件

const Index = () => {
  // 定義文件上傳處理函數
  const handleFileUpload = (file) => {
    console.log("選擇的文件:", file);
    // 在這裡可以添加文件上傳的處理邏輯
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-wrap">
        <h2>Hello Team Sweety Time : D</h2>
        <ElementList />
      </div>
    </AdminLayout>
  );
};

export default Index;
