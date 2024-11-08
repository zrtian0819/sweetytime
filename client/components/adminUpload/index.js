// components/UploadImage.js
import React from 'react';
import styles from './upload.module.scss';

const UploadImage = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    if (onFileUpload) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <label htmlFor="fileUpload" className={styles.customFileUpload}>
        選擇圖片
        <input type="file" id="fileUpload" className={styles.fileInput} onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default UploadImage;
