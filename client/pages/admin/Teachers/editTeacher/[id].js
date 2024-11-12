import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Button, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';
import AdminThemeProvider from '../../adminEdit';
import styles from '@/components/ElementList/ElementList.module.scss';
import ReturnBtn from '@/components/button/expand-button';
import axios from 'axios';
import Swal from 'sweetalert2';

const initialTeacherData = {
    title: '',
    name: '',
    description: '',
    expertise: '',
    experience: '',
    education: '',
    licence: '',
    awards: '',
    valid: false,
    img_path: null,
};

const profileImageStyle = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const EditTeacher = () => {
    const [teacherData, setTeacherData] = useState(initialTeacherData);
    const [previewImage, setPreviewImage] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:3005/api/teacher/teacherDetail/${id}`)
                .then((res) => {
                    const data = res.data;
                    setTeacherData({
                        title: data.title || '',
                        name: data.name || '',
                        description: data.description || '',
                        expertise: data.expertise || '',
                        experience: data.experience || '',
                        education: data.education || '',
                        licence: data.licence || '',
                        awards: data.awards || '',
                        valid: data.activation === 1,
                        img_path: data.img_path || null,
                    });
                    // 只有在有圖片的情況下設置預覽
                    if (data.img_path) {
                        setPreviewImage(`/uploads/${data.img_path}`);
                    }
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
            setTeacherData({ ...teacherData, img_path: file });
            setPreviewImage(URL.createObjectURL(file)); // 更新圖片預覽
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(teacherData).forEach((key) => {
            formData.append(key, key === 'valid' ? (teacherData[key] ? 1 : 0) : teacherData[key]);
        });

        try {
            await axios.put(`http://localhost:3005/api/teacher/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Swal.fire({
                icon: 'success',
                title: '更新成功！',
                text: '教師資料已成功更新。',
                confirmButtonText: '返回列表頁',
                confirmButtonColor: '#fe6f67',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/admin/Teachers');
                }
            });
        } catch (error) {
            console.error('更新教師資料失敗:', error);
            alert('更新教師資料失敗，請檢查後再試。');
        }
    };

    return (
        <AdminThemeProvider>
            <AdminLayout>
                <Box style={{ marginLeft: '25px' }}>
                    <Link href="/admin/Teachers" passHref>
                        <ReturnBtn value="返回師資列表" />
                    </Link>
                </Box>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.container}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <div style={profileImageStyle}>
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                    }}
                                />
                            ) : (
                                <span>未上傳圖片</span>
                            )}
                        </div>
                        <label style={{ marginTop: '10px' }}>
                            <Button variant="contained" component="label" style={{ marginTop: '10px' }}>
                                上傳圖片
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </Button>
                        </label>
                    </Box>

                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={2}>
                        <TextField label="職稱" name="title" value={teacherData.title} onChange={handleInputChange} fullWidth />
                        <TextField label="姓名" name="name" value={teacherData.name} onChange={handleInputChange} fullWidth />
                        <TextField label="專業領域" name="expertise" value={teacherData.expertise} onChange={handleInputChange} fullWidth />
                    </Box>

                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
                        <TextField label="經歷" name="experience" value={teacherData.experience} onChange={handleInputChange} fullWidth />
                        <TextField label="學歷" name="education" value={teacherData.education} onChange={handleInputChange} fullWidth />
                        <TextField label="證書" name="licence" value={teacherData.licence} onChange={handleInputChange} fullWidth />
                        <TextField label="獎項" name="awards" value={teacherData.awards} onChange={handleInputChange} fullWidth />
                    </Box>
                    <TextField
                        label="簡介"
                        name="description"
                        value={teacherData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={8}
                        fullWidth
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <FormControlLabel
                            control={<Checkbox checked={teacherData.valid} onChange={handleCheckboxChange} name="valid" color="primary" />}
                            label="聘僱中"
                        />

                        <Button type="submit" variant="contained" color="primary">
                            更新
                        </Button>
                    </Box>
                </form>
            </AdminLayout>
        </AdminThemeProvider>
    );
};

export default EditTeacher;
