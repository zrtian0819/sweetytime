import React from 'react'
import styles from '../../styles/WGS-login.module.css'

const Login = () => {
  return (
    <>
      <div className={styles['WGS-loginContainer']}>
        <div className={styles['WGS-loginBgS']}>SWEETY SWEETY SWEETY</div>
        <div className={styles['WGS-loginBgT']}>TIME TIME TIME TIME</div>
        <div className={styles['WGS-loginCard']}>
          <h1 className={styles['WGS-title']}>Sweety time</h1>
          <form className={styles['WGS-loginForm']}>
            <input
              className={styles['WGS-loginInput']}
              type="text"
              placeholder="user name"
              required
            />
            <div className={styles['WGS-passwordContainer']}>
              <input
                className={styles['WGS-loginInput']}
                type="password"
                placeholder="password"
                required
              />
            </div>
            <div className={styles['WGS-rememberMe']}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">記住我</label>
            </div>
            <div>
              <div className={styles['WGS-errorMessage']}>
                帳號密碼錯誤,請再試一次
              </div>
              <button className={styles['WGS-loginBtn']} type="submit">
                登 入
              </button>
            </div>
          </form>
          <div className={styles['WGS-bottomLinks']}>
            <a href="#">成為會員</a>
            <a href="#">忘記密碼</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
