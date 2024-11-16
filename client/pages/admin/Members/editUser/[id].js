import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Button, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';
import AdminThemeProvider from '../../adminEdit';
import styles from '@/components/ElementList/ElementList.module.scss';
import ReturnBtn from '@/components/button/expand-button';
import axios from 'axios';

const initialUserData = {
    name: '',
    email: '',
    phone: '',
    birthday: '',
    account: '',
    activation: false,
};

const profileImageStyle = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const EditUser = () => {
    const [userData, setUserData] = useState(initialUserData);
    const [previewImage, setPreviewImage] = useState('/photos/user/default.png');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:3005/api/user/${id}`)
                .then((res) => {
                    const data = res.data;
                    setUserData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        birthday: data.birthday || '',
                        account: data.account || '',
                        activation: data.activation === 1,
                    });
                    setPreviewImage(`/photos/user/${data.portrait_path || 'default.png'}`);
                })
                .catch((error) => console.error('無法獲取會員資料:', error));
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setUserData({ ...userData, activation: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
            if (key === 'activation') {
                formData.append('activation', userData[key] ? 1 : 0);
            } else {
                formData.append(key, userData[key]);
            }
        });

        try {
            await axios.put(`http://localhost:3005/api/user/edit/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('更新成功');
            router.push('/admin/Members?reload=true');
        } catch (error) {
            console.error('更新會員資料失敗:', error);
            alert('更新會員資料失敗，請檢查後再試。');
        }
    };

    return (
        <AdminThemeProvider>
            <AdminLayout>
                <Box style={{ marginLeft: '25px' }}>
                    <Link href="/admin/Members" passHref>
                        <ReturnBtn value="返回會員列表" />
                    </Link>
                </Box>
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className={styles.container}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mb={2}
                        style={{ marginTop: '-60px' }}
                    >
                        <label
                            htmlFor="profile_image"
                            className={styles.formControlCustom}
                            style={{ marginBottom: '10px' }}
                        >
                            上傳圖片:
                        </label>
                        <img src={previewImage} alt="Profile Preview" style={profileImageStyle} />
                    </Box>

                    {/* 將「姓名」、「生日」和「電話」放在同一列 */}
                    <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2} mb={2}>
                        <TextField
                            label="姓名"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className={styles.formControlCustom}
                            fullWidth
                        />
                        <TextField
                            label=""
                            name="birthday"
                            value={userData.birthday}
                            onChange={handleInputChange}
                            type="date"
                            className={styles.formControlCustom}
                            fullWidth
                        />
                        <TextField
                            label="電話"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className={styles.formControlCustom}
                            fullWidth
                        />
                    </Box>

                    <Box display="grid" gridTemplateColumns="1fr" gap={2} mb={2}>
                        <TextField
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className={styles.formControlCustom}
                            fullWidth
                        />
                    </Box>

                    <Box display="grid" gridTemplateColumns="1fr" gap={2} mb={2}>
                        <TextField
                            label="帳號"
                            name="account"
                            value={userData.account}
                            onChange={handleInputChange}
                            className={styles.formControlCustom}
                            fullWidth
                        />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={userData.activation}
                                    onChange={handleCheckboxChange}
                                    name="activation"
                                    color="primary"
                                    className={styles.formCheckInput}
                                />
                            }
                            label="有效"
                            className={styles.formCheckLabel}
                        />

                        <Button type="submit" variant="contained" className={styles.btnCustom}>
                            更新
                        </Button>
                    </Box>
                </form>
            </AdminLayout>
        </AdminThemeProvider>
    );
};

export default EditUser;
