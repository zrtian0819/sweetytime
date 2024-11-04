import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Img from 'next/image';
import Styles from './style.module.scss';

export default function LoginButton() {
  const router = useRouter()
  const { data: session } = useSession()

  // 判斷是否登入
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  if (session) {
    return (
      <div>
        <p>歡迎, {session.user.email}</p>
        <button className={Styles['WGS-loginBtn']} onClick={() => signOut()}>登出</button>
      </div>
    )
  }
  
  return (
    <button 
      className={Styles['WGS-loginBtn']} 
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      <Img src="/icon/google_icon.png" width={30} height={30} alt="google" />
      使用 Google 登入
    </button>
  )
}