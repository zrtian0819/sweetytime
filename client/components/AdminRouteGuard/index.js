import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext'; 

const AdminRouteGuard = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // 確保不是在加載狀態且使用者資訊已載入
    if (!loading) {
      // 檢查是否在 /admin 路徑下且使用者角色是 user
      if (router.pathname.startsWith('/admin') && user?.role === 'user') {
        // 顯示警告訊息
        alert('你想做什麼！');
        // 重導向到首頁
        router.push('/');
      }
    }
  }, [loading, user, router.pathname]);

  // 在加載狀態時顯示載入中
  if (loading) {
    return <div>Loading...</div>;
  }

  // 如果是在 /admin 路徑下且使用者角色是 user，返回 null（不渲染內容）
  if (router.pathname.startsWith('/admin') && user?.role === 'user') {
    return null;
  }

  // 其他情況正常渲染子組件
  return children;
};

export default AdminRouteGuard;