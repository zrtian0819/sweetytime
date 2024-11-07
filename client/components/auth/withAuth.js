import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/userContext';

export const withAuth = (WrappedComponent) => {
  const AuthProtected = (props) => {
    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login?redirect=' + router.pathname);
      }
    }, [user, isLoading, router]);

    // 顯示載入中狀態
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // 如果沒有用戶資料，返回 null（頁面會被重定向）
    if (!user) {
      return null;
    }

    // 有用戶資料，渲染原始組件
    return <WrappedComponent {...props} />;
  };

  // 複製原始組件的靜態方法和displayName
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  AuthProtected.displayName = `withAuth(${componentName})`;

  return AuthProtected;
};