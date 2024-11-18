import { useState, useEffect } from 'react';
import ExpandButton from '@/components/button/expand-button';
import Link from 'next/link';
import useInterval from '@/hooks/use-interval';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import styles from '../../../styles/WGS-login.module.scss';

// API 請求函數
const requestOtpToken = async (email) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/request-otp`, {
      email,
    });
    return response;
  } catch (error) {
    return {
      data: {
        status: 'error',
        message: error.response?.data?.message || '發送驗證碼失敗',
      },
    };
  }
};

const resetPassword = async (email, newPassword, otp) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-password/reset-password`, {
      email,
      newPassword,
      otp,
    });
    return response;
  } catch (error) {
    return {
      data: {
        status: 'error',
        message: error.response?.data?.message || '重設密碼失敗',
      },
    };
  }
};

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [disableBtn, setDisableBtn] = useState(false);
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState(null);

  useInterval(() => {
    setCount(count - 1);
  }, delay);

  useEffect(() => {
    if (count <= 0) {
      setDelay(null);
      setDisableBtn(false);
    }
  }, [count]);

  const handleRequestOtpToken = async (e) => {
    e.preventDefault(); // 防止表單提交
    if (delay !== null) {
      toast.error('錯誤 - 60s內無法重新獲得驗證碼');
      return;
    }

    if (!email) {
      toast.error('請輸入電子郵件');
      return;
    }

    const res = await requestOtpToken(email);

    if (res.data.status === 'success') {
      toast.success('驗證碼已寄送到電子郵件中');
      setCount(60);
      setDelay(1000);
      setDisableBtn(true);
    } else {
      toast.error(`錯誤 - ${res.data.message}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); // 防止表單提交

    if (!email || !password || !token) {
      toast.error('請填寫所有欄位');
      return;
    }

    // 密碼驗證
    if (password.length < 5) {
      toast.error('密碼長度至少需要5個字符');
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('密碼需要包含至少一個字母（大小寫皆可）、一個數字');
      return;
    }

    const res = await resetPassword(email, password, token);

    if (res.data.status === 'success') {
      toast.success('密碼已成功修改');
      // 可以在這裡添加重定向到登入頁面
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      toast.error(`錯誤 - ${res.data.message}`);
    }
  };

  return (
    <div className={styles['WGS-loginContainer']}>
      <div className={styles['WGS-back']}>
        <Link href="/login">
          <ExpandButton value="返回登入" />
        </Link>
      </div>
      <div className={styles['WGS-loginCardPW']}>
        <h1 className={styles['WGS-title']}>Sweety time</h1>
        <h3 className={styles['WGS-title2']}>忘記密碼</h3>
        <form className={styles['WGS-loginForm']} onSubmit={handleResetPassword}>
          <input
            className={styles['WGS-loginInput']}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="輸入您的email"
            required
          />
          <div>
            <div className={styles['WGS-otpGroup']}>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="輸入驗證碼"
                required
              />
              <button
                type="button"
                onClick={handleRequestOtpToken}
                disabled={disableBtn}
                className={styles['WGS-otpButton']}
              >
                {delay ? `${count}秒後重試` : '取得驗證碼'}
              </button>
            </div>
            
            <div className={styles['WGS-inputGroup']}>
              <label>
                新密碼:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少8位，包含大小寫字母和數字"
                  required
                />
              </label>
            </div>
            
            <button
              type="submit"
              className={styles['WGS-loginBtn']}
            >
              重設密碼
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default ForgetPassword;