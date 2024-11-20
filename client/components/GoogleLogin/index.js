// components/GoogleLogin.js
import React, { useState } from 'react';
import Img from 'next/image'
import { useGoogleLogin } from '@react-oauth/google';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './style.module.scss';

const GoogleLogin = () => {
  const { login } = useUser();
  const router = useRouter();
  const [error, setError] = useState('');

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log('Google OAuth success:', response);

        // 獲取用戶信息
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        console.log('Google user info:', userInfo.data);

        // 整理要發送給後端的數據
        const googleUserData = {
          sub: userInfo.data.sub,
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          access_token: response.access_token
        };

        // 發送到後端進行驗證和登入
        const loginResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/google-login`,
          { googleUser: googleUserData }
        );

        if (loginResponse.data.success) {
          const { token, user } = loginResponse.data;
          await login(token, user);
          
          if (user.role === 'admin' || user.role === 'shop') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Google login error details:', error.response?.data);
        setError(error.response?.data?.message || '登入失敗，請稍後再試');
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setError('Google 登入失敗，請稍後再試');
    },
  });

  return (
    <div>
      <button 
        onClick={() => {
          setError('');
          googleLogin();
        }}
        className={styles['WGS-loginBtn']}
      >
      <Img src="/icon/google_icon.png" width={30} height={30} alt="google" />
      </button>
      {error && <div className={styles['WGS-errorMessage']}>{error}</div>}
    </div>
  );
};

export default GoogleLogin;