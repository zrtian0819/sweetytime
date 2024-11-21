import React from 'react';
import { useRouter } from 'next/router';  // 改用 next/router
import UserSidebar from '@/components/user/userSideBar';
import Styles from '@/components/user/userBox/userBox.module.scss';

export default function UserBox({ children }) {
  const router = useRouter();  // 使用 useRouter
  const pathname = router.pathname;  // 從 router 物件獲取 pathname

  // 根據路徑返回對應的標題
  const getTitle = () => {
    if (pathname.includes('/user/account')) {
		return '個人資料';
	  } else if (pathname.includes('/user/collection')) {
		return '我的收藏';
	  } else if (pathname.includes('/user/purchase')) {
		return '我的訂單';
	  } else if (pathname.includes('/user/voucher-wallet')) {
		return '優惠券';
	  } else {
		return '個人資料';
	  }
	};

  return (
    <div className={Styles['TIL-body']}>
      <div className={`${Styles['TIL-userbody']} container`}>
        <div className="row">
          {/* 左側導航欄 */}
          <div className="col-12 col-md-2 p-0 pe-md-2">
            <UserSidebar />
          </div>

          {/* 右側內容區域 */}
          <div className={`${Styles['TIL-user-right']} col-12 col-md-10 p-0 p-md-5`}>
            <div className={`${Styles['TIL-content-title']} d-block d-md-none p-0`}>
              {getTitle()}
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}