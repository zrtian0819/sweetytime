import React, { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import styles from '@/components/user/userSideBar/UserAvatarUpload.module.scss';

const UserAvatarUpload = ({ currentImage, onImageUpload }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [previewImage, setPreviewImage] = useState(currentImage);
  
    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        alert('請上傳圖片檔案');
        return;
      }
  
      // 檢查檔案大小 (限制為 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('圖片大小不能超過 2MB');
        return;
      }
  
      // 建立預覽
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
  
      // 呼叫父組件的上傳處理函數
      onImageUpload(file);
    };
  
    return (
      <div className={styles.avatarContainer}>
        <div 
          className={styles.avatarWrapper}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={previewImage}
            alt="使用者頭像"
            width={100}
            height={100}
            className={styles.avatarImage}
          />
          
          <label className={`${styles.uploadOverlay} ${isHovered ? styles.show : ''}`}>
            <input
              type="file"
              className={styles.fileInput}
              accept="image/*"
              onChange={handleFileChange}
            />
            <Camera className={styles.cameraIcon} />
            <span className={styles.uploadText}>更換頭像</span>
          </label>
        </div>
      </div>
    );
  };
  
  export default UserAvatarUpload;