import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { 
    Button, 
    TextField, 
    Checkbox, 
    FormControlLabel, 
    Box, 
    CircularProgress, 
    Alert,
    IconButton
} from '@mui/material';
import AdminThemeProvider from '../../adminEdit';
import styles from '@/components/ElementList/ElementList.module.scss';
import ReturnBtn from '@/components/button/expand-button';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                setError('');
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${id}`);
                
                setUserData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    birthday: res.data.birthday ? res.data.birthday.split('T')[0] : '',
                    account: res.data.account || '',
                    activation: res.data.activation === 1,
                });
                
                if (res.data.portrait_path) {
                    setPreviewImage(`/photos/user/${res.data.portrait_path}`);
                }
            } catch (err) {
                console.error('無法獲取會員資料:', err);
                setError(err.response?.data?.message || '無法獲取會員資料');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        setUserData(prev => ({
            ...prev,
            activation: e.target.checked
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('圖片大小不能超過 2MB');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                setError('只支援 JPG、PNG 與 GIF 圖片格式');
                return;
            }

            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);
    
        try {
            // 基本驗證
            if (!userData.name || !userData.email) {
                throw new Error('姓名和 Email 為必填欄位');
            }
    
            // 轉換資料格式
            const submitData = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone || null,
                birthday: userData.birthday || null,
                activation: userData.activation ? 1 : 0,
                account: userData.account
            };
    
            // 發送更新請求
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/edit/${id}`,
                submitData
            );
    
            if (response.data.success) {
                setSuccessMessage('更新成功');
                // 更新本地狀態以反映新的資料
                setUserData({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    phone: response.data.user.phone || '',
                    birthday: response.data.user.birthday ? response.data.user.birthday.split('T')[0] : '',
                    account: response.data.user.account,
                    activation: response.data.user.activation === 1
                });
    
                // 延遲後再跳轉
                setTimeout(() => {
                    router.push('/admin/Members?reload=true');
                }, 1500);
            }
        } catch (err) {
            console.error('更新會員資料失敗:', err);
            setError(err.response?.data?.message || err.message || '更新會員資料失敗，請檢查後再試');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminThemeProvider>
                <AdminLayout>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                    </Box>
                </AdminLayout>
            </AdminThemeProvider>
        );
    }

    return (
        <AdminThemeProvider>
            <AdminLayout>
                <Box style={{ marginLeft: '25px' }}>
                    <Link href="/admin/Members" passHref>
                        <ReturnBtn value="返回會員列表" />
                    </Link>
                </Box>
                
                {error && (
                    <Box mb={2} mx={3}>
                        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
                    </Box>
                )}
                
                {successMessage && (
                    <Box mb={2} mx={3}>
                        <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
                    </Box>
                )}

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
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-image-input"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="profile-image-input">
                            <Box position="relative" display="inline-block">
                                <img 
                                    src={previewImage} 
                                    alt="Profile Preview" 
                                    style={profileImageStyle}
                                    onError={(e) => {
                                        e.target.src = '/photos/user/default.png';
                                    }}
                                />
                                <IconButton 
                                    color="primary"
                                    aria-label="upload picture"
                                    component="span"
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        right: '0px',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </Box>
                        </label>
                    </Box>

                    <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2} mb={2}>
                        <TextField
                            label="姓名"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className={styles.formControlCustom}
                            fullWidth
                            required
                            error={!userData.name}
                            helperText={!userData.name ? "姓名為必填欄位" : ""}
                        />
                        <TextField
                            label="生日"
                            name="birthday"
                            type="date"
                            value={userData.birthday}
                            onChange={handleInputChange}
                            className={styles.formControlCustom}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
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
                            required
                            error={!userData.email}
                            helperText={!userData.email ? "Email為必填欄位" : ""}
                            type="email"
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
                            disabled
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

                        <Button 
                            type="submit" 
                            variant="contained" 
                            className={styles.btnCustom}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : '更新'}
                        </Button>
                    </Box>
                </form>
            </AdminLayout>
        </AdminThemeProvider>
    );
};

export default EditUser;