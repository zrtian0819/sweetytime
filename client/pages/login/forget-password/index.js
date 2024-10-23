import React from 'react'
import styles from '../../../styles/WGS-login.module.scss'

const Login = () => {
  return (
    <>
      <div className={styles['WGS-loginContainer']}>
        <div className={styles['WGS-loginBgS']}>SWEETY SWEETY SWEETY</div>
        <div className={styles['WGS-loginBgT']}>TIME TIME TIME TIME</div>
        <div className={styles['WGS-loginCard']}>
          <h1 className={styles['WGS-title']}>Sweety time</h1>
          <h2 className={styles['WGS-title']}>忘記密碼</h2>
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
            <div>
              <div className={styles['WGS-errorMessage']}>
                兩次密碼不同,請再試一次
              </div>
              <button className={styles['WGS-loginBtn']} type="submit">
                登 入
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
