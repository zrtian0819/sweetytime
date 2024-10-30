import { useSession, signIn, signOut } from 'next-auth/react'
import Img from 'next/image'
import Styles from './style.module.scss';

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.email}</p>
        <button onClick={() => signOut()}>登出</button>
      </div>
    )
  }
  return (
    <button className={Styles['WGS-loginBtn']} onClick={() => signIn('google')}>
      <Img src="/icon/google_icon.png" width={30} height={30} alt="google" />
      使用 Google 登入
    </button>
  )
}