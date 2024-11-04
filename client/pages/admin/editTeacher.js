// pages/admin/editTeacher.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import { Button, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';
import AdminThemeProvider from './adminEdit'; // 引入 AdminThemeProvider
import styles from '../../components/ElementList/ElementList.module.scss';

const initialTeacherData = {
  name: '',
  description: '',
  expertise: '',
  experience: '',
  education: '',
  licence: '',
  awards: '',
  valid: false,
  imgSrc: '/photos/teachers/Maggie.png', // 預設圖片路徑
};

const EditTeacher = () => {
  const [teacherData, setTeacherData] = useState(initialTeacherData);
  const [previewImage, setPreviewImage] = useState(initialTeacherData.imgSrc);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      setTeacherData({
        ...initialTeacherData,
        name: '王美姬 Maggie',
        description: '擁有豐富的教學經驗...',
        expertise: '糕點製作',
        experience: '10年以上的糕點製作經驗',
        education: '食品科學碩士',
        licence: '專業糕點師證書',
        awards: '全國糕點比賽冠軍',
        valid: true,
        imgSrc: '/photos/teachers/Maggie.png',
      });
      setPreviewImage('/photos/teachers/Maggie.png');
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({ ...teacherData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setTeacherData({ ...teacherData, valid: e.target.checked });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setTeacherData({ ...teacherData, imgSrc: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交的教師數據:', teacherData);
    router.push('/admin/teacher');
  };

  return (
    <AdminThemeProvider> {/* 使用 AdminThemeProvider 包裹頁面內容 */}
      <AdminLayout>
        <h2 className={styles.formControlCustom}>修改教師資料</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.container}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <label htmlFor="profile_image" className={styles.formControlCustom} style={{ marginBottom: '10px' }}>上傳或更改圖片:</label>
            <img
              src={previewImage}
              alt="Profile Preview"
              style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
            />
            <label className={styles.customFileUpload}>
              上傳圖片
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </label>
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <TextField
              label="姓名"
              name="name"
              value={teacherData.name}
              onChange={handleInputChange}
              className={styles.formControlCustom}
              fullWidth
            />
            <TextField
              label="專業領域"
              name="expertise"
              value={teacherData.expertise}
              onChange={handleInputChange}
              className={styles.formControlCustom}
              fullWidth
            />
            <TextField
              label="經歷"
              name="experience"
              value={teacherData.experience}
              onChange={handleInputChange}
              className={styles.formControlCustom}
              fullWidth
            />
            <TextField
              label="學歷"
              name="education"
              value={teacherData.education}
              onChange={handleInputChange}
              className={styles.formControlCustom}
              fullWidth
            />
            <TextField
              label="證書"
              name="licence"
              value={teacherData.licence}
              onChange={handleInputChange}
              className={styles.formControlCustom}
              fullWidth
            />
            <TextField
              label="獎項"
              name="awards"
              value={teacherData.awards}
              onChange={handleInputChange}
              className={styles.formControlCustom}
              fullWidth
            />
            <TextField
              label="簡介"
              name="description"
              value={teacherData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              className={styles.textareaCustom}
              fullWidth
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={teacherData.valid}
                onChange={handleCheckboxChange}
                name="valid"
                color="primary"
                className={styles.formCheckInput}
              />
            }
            label="有效"
            className={styles.formCheckLabel}
          />

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" className={styles.btnCustom}>
              儲存
            </Button>
          </Box>
        </form>
      </AdminLayout>
    </AdminThemeProvider>
  );
};

export default EditTeacher;
