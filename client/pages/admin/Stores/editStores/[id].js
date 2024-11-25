import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import styles from '@/styles/adminShop.module.scss';
import AdminThemeProvider from '../../adminEdit';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import ExpandButton from '@/components/button/expand-button';
import sweetAlert from '@/components/sweetAlert';
import { useUser } from '@/context/userContext';
import bcrypt from 'bcryptjs';

export default function Editshop() {
    const router = useRouter();
    const { user, logout } = useUser();
    const { id } = router.query;
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(0);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [signUpTime, setSignUpTime] = useState('');
    const editorRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangeSta = (event) => {
        setStatus(event.target.value);
    };

    const handleEdit = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('photo', selectedImage);
            await axios.put(
                `http://localhost:3005/api/shop/admin/upload/${id}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            sweetAlert({
                title: '成功',
                text: '照片更新成功',
                icon: 'success',
                confirmButtonText: '確定'
            });
        } catch (error) {
            console.error('更新照片失敗', error);
            sweetAlert({
                title: '失敗',
                text: '照片更新失敗',
                icon: 'error',
                confirmButtonText: '確定'
            });
        }
    };

    // 密碼加密處理函數
    const hashPassword = async (plainPassword) => {
        if (!plainPassword) return '';
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(plainPassword, 10);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('address', address);

            // 密碼處理
            if (newPassword) {
                const hashedPassword = await hashPassword(newPassword);
                formData.append('password', hashedPassword);
            } else {
                formData.append('password', password);
            }

            formData.append('status', status);
            formData.append('description', editorRef.current?.getContent() || '');

            if (selectedImage) {
                formData.append('photo', selectedImage);
            } else {
                formData.append('photo', data.logo_path);
            }

            const response = await axios.put(
                user.role === 'admin'
                    ? `http://localhost:3005/api/shop/admin/update/${id}`
                    : `http://localhost:3005/api/shopBackstage-order/update/${user.id}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            sweetAlert({
                title: '編輯成功',
                text: '已成功更新店家資料！',
                icon: 'success',
                confirmButtonText: '完成',
                href: user.role === 'admin'
                    ? `/admin/Stores/viewStores/${id}`
                    : `/admin/Stores/viewStores/${user.id}`,
            });
        } catch (error) {
            console.error('更新失敗:', error);
            sweetAlert({
                title: '編輯失敗',
                text: '更新資料時發生錯誤，請稍後再試',
                icon: 'error',
                confirmButtonText: '確定'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 獲取指定商家的資料
    useEffect(() => {
        if (user) {
            axios
                .get(
                    user.role === 'admin'
                        ? `http://localhost:3005/api/shop/${id}`
                        : `http://localhost:3005/api/shopBackstage-order/${user.id}`
                )
                .then((res) => {
                    setData(res.data);
                    setPreviewImage(
                        `/photos/shop_logo/${res.data.logo_path || 'shop_default.png'}`
                    );
                    setPassword(res.data.password);
                    setName(res.data.name);
                    setStatus(res.data.activation);
                    setAddress(res.data.address || '');
                    setPhone(res.data.phone || '');
                    setSignUpTime(res.data.sign_up_time || '');
                })
                .catch((error) => {
                    console.error('找不到商家資料', error);
                    sweetAlert({
                        title: '錯誤',
                        text: '無法載入商家資料',
                        icon: 'error',
                        confirmButtonText: '確定'
                    });
                });
        }
    }, [user, id]);

    if (!user) {
        return (
            <h2 style={{ color: '#fe6f67' }} className="text-center mt-5">
                請先登入系統。
            </h2>
        );
    }

    return (
        <>
            {data ? (
                <AdminThemeProvider>
                    <AdminLayout style={{ position: 'relative' }}>
                        <div className="container" style={{ overflowY: 'auto', height: '100%', scrollbarWidth: '15px' }}>
                            {user.role === 'admin' ? (
                                <Link href="../">
                                    <ExpandButton value="返回列表頁" />
                                </Link>
                            ) : (
                                <Link href={`../viewStores/${id}`}>
                                    <ExpandButton value="返回列表頁" />
                                </Link>
                            )}
                            <form onSubmit={handleSubmit} className="row mt-5">
                                <div className="col-6 text-center my-auto">
                                    <Image
                                        src={previewImage || '/photos/shop_logo/shop_default.png'}
                                        alt={name ? `${name} logo` : 'Default shop logo'}
                                        width={450}
                                        height={350}
                                        className="m-auto"
                                        style={{ objectFit: 'contain', borderRadius: '25px' }}
                                    />

                                    <div className="d-flex flex-row justify-content-center mt-3">
                                        <Button
                                            variant="contained"
                                            className="m-2"
                                            component="label"
                                            sx={{ color: '#FFF', background: '#fe6f67' }}
                                            disabled={isSubmitting}
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleEdit}
                                            />
                                            更新照片
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className="m-2"
                                            onClick={handleUpload}
                                            sx={{ color: '#FFF', background: '#fe6f67' }}
                                            disabled={!selectedImage || isSubmitting}
                                        >
                                            確認上傳
                                        </Button>
                                    </div>
                                </div>

                                <Box
                                    display="grid"
                                    gridTemplateColumns="1fr 1fr"
                                    gap={2}
                                    m={2}
                                    className="col-6 d-flex flex-column m-0"
                                >
                                    <TextField
                                        label="店家名稱"
                                        name="name"
                                        value={name}
                                        className={styles.formControlCustom}
                                        fullWidth
                                        size="small"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <TextField
                                        label="電話"
                                        name="phone"
                                        value={phone}
                                        className={styles.formControlCustom}
                                        fullWidth
                                        size="small"
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <TextField
                                        label="地址"
                                        name="address"
                                        value={address}
                                        className={styles.formControlCustom}
                                        fullWidth
                                        size="small"
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    {user.role !== 'admin' && (
                                        <TextField
                                            label="修改登入密碼"
                                            name="password"
                                            type="password"
                                            className={styles.formControlCustom}
                                            fullWidth
                                            size="small"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="若不修改密碼請留空"
                                            autoComplete="new-password"
                                        />
                                    )}
                                    {user.role === 'admin' && (
                                        <FormControl fullWidth>
                                            <InputLabel id="status-select-label">狀態</InputLabel>
                                            <Select
                                                labelId="status-select-label"
                                                id="status-select"
                                                value={status}
                                                label="status"
                                                onChange={handleChangeSta}
                                                size="small"
                                            >
                                                <MenuItem value={1}>啟用中</MenuItem>
                                                <MenuItem value={0}>停用中</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                    <div className={`${styles['CTH-class-info']} d-flex flex-column`}>
                                        <h3 className={styles['TIL-text']}>商家簡介</h3>
                                        <Editor
                                            apiKey="your-tinymce-api-key"
                                            onInit={(evt, editor) => (editorRef.current = editor)}
                                            initialValue={data.description}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount'
                                                ],
                                                toolbar:
                                                    'undo redo | formatselect | bold italic backcolor | \
                                                    alignleft aligncenter alignright alignjustify | \
                                                    bullist numlist outdent indent | removeformat | help'
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                color: '#fff',
                                                background: '#fe6f67',
                                                width: '100px',
                                                ml: 'auto',
                                                marginTop: '20px'
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? '處理中...' : '完成編輯'}
                                        </Button>
                                    </div>
                                </Box>
                            </form>
                        </div>
                    </AdminLayout>
                </AdminThemeProvider>
            ) : (
                <h2 style={{ color: '#fe6f67' }} className="text-center mt-5">
                    您沒有權限進入此頁，請從正確管道進入。
                </h2>
            )}
        </>
    );
}