import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import { Button, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';
import AdminThemeProvider from '../adminEdit'; // 引入 AdminThemeProvider
import styles from '../../../components/ElementList/ElementList.module.scss';
import axios from 'axios';

const initialTeacherData = {
  name: '',
  description: '',
  expertise: '',
  experience: '',
  education: '',
  licence: '',
  awards: '',
  valid: false,
  img_path: '/photos/teachers/Maggie.png', // 預設圖片路徑
};

const EditTeacher = () => {
  const [teacherData, setTeacherData] = useState(initialTeacherData);
  const [previewImage, setPreviewImage] = useState(initialTeacherData.img_path);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3005/api/teacher/teacherDetail/${id}`)
        .then((res) => {
          const data = res.data;
          setTeacherData({
            name: data.name || '',
            description: data.description || '',
            expertise: data.expertise || '',
            experience: data.experience || '',
            education: data.education || '',
            licence: data.licence || '',
            awards: data.awards || '',
            valid: data.status === 1,
            img_path: data.img_path ? `/photos/teachers/${data.img_path}` : initialTeacherData.img_path,
          });
          setPreviewImage(data.img_path ? `/photos/teachers/${data.img_path}` : initialTeacherData.img_path);
        })
        .catch((error) => console.error('無法獲取教師資料:', error));
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
      setTeacherData({ ...teacherData, img_path: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(teacherData).forEach((key) => formData.append(key, teacherData[key]));

    axios
      .put(`http://localhost:3005/api/teacher/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        router.push('/admin/teacher');
      })
      .catch((error) => console.error('更新教師資料失敗:', error));
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
