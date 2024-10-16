import React from 'react'
import styles from '../styles/WGS-login.module.css'

const Login = () => {
  return (
    <>
      <div className={styles.WGSloginContainer}>
        <div className={styles.WGSloginBgS}>SWEETY SWEETY SWEETY</div>
        <div className={styles.WGSloginBgT}>TIME TIME TIME TIME</div>
        <div className={styles.WGSloginCard}>
          <h1 className={styles.WGStitle}>Sweety time</h1>
          <form className={styles.WGSloginForm}>
            <input
              className={styles.WGSloginInput}
              type="text"
              placeholder="user name"
              required=""
            />
            <div className={styles.WGSpasswordContainer}>
              <input
                className={styles.WGSloginInput}
                type="password"
                placeholder="password"
                required=""
              />
            </div>
            <div className={styles.WGSrememberMe}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">記住我</label>
            </div>
            <div>
              <div className={styles.WGSerrorMessage}>
                帳號密碼錯誤,請再試一次
              </div>
              <button className={styles.WGSloginBtn} type="submit">
                登 入
              </button>
            </div>
          </form>
          <div className={styles.WGSbottomLinks}>
            <a href="#">成為會員</a>
            <a href="#">忘記密碼</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
