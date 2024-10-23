import React from 'react'
import styles from '../../../styles/WGS-login.module.scss'

const Registerin = () => {
  return (
    <>
      <div className={`${styles['WGS-registerinContainer']}`}>
        <div className={styles['WGS-loginBgS']}>SWEETY SWEETY SWEETY SWEETY SWEETY SWEETY SWEETY</div>
        <div className={styles['WGS-loginBgT']}>TIME TIME TIME TIME TIME TIME TIME TIME</div>
        <div className={styles['WGS-registerinCard']}>
          <h1 className={styles['WGS-title']}>會員註冊</h1>
          <input
            className={styles['WGS-register-input']}
            placeholder="first name | 姓氏"
          />
          <input
            className={styles['WGS-register-input']}
            placeholder="last name | 姓名"
          />
          <select className={styles['WGS-register-select']}>
            <option value="" disabled selected>
              gender | 性別
            </option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
          <input
            className={styles['WGS-register-input']}
            placeholder="phone | 電話"
          />
          <input
            className={styles['WGS-register-input']}
            placeholder="e-mail | 電子信箱"
            type="email"
          />
          <input
            className={styles['WGS-register-date']}
            type="date"
            placeholder="birthday | 生日"
            required
          />
          <input
            className={styles['WGS-register-input']}
            placeholder="account | 帳號"
          />
          <input
            className={styles['WGS-register-input']}
            placeholder="password | 密碼"
            type="password"
          />
          <input
            className={styles['WGS-register-input']}
            placeholder="retype password | 重新輸入密碼"
            type="password"
          />
          <div className={styles['WGS-checkbox-container']}>
            <input
              type="checkbox"
              id="terms"
              className={styles['WGS-checkbox']}
            />
            <label htmlFor="terms">
              請查看<span className={styles['WGS-terms']}>使用條款</span>
              以保障個人權益
            </label>
          </div>
          <button className={styles['WGS-submit-button']}>
            我要申請成為會員
          </button>
        </div>
      </div>
    </>
  )
}

export default Registerin
