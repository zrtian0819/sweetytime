import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// 建立 UserContext 以便在應用中提供用戶的狀態
const UserContext = createContext(null);

// 自定義 Hook 來方便地使用 UserContext 的值
export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		// 確保 useUser 必須在 UserProvider 內部使用
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};

// UserProvider 用於包裹應用，提供用戶狀態和操作方法
export function UserProvider({ children }) {
	// 設定 user 狀態以保存用戶資訊，loading 表示載入狀態
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// useEffect 用於初始化檢查用戶的登入狀態
	useEffect(() => {
		const initializeAuth = async () => {
			try {
				// 從 localStorage 中取得 token
				const token = localStorage.getItem('accessToken');

				if (token) {
					// 設置 axios 預設 headers 為 Authorization
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

					// 驗證 token 的有效性
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/verify`
					);
					setUser(response.data.user); // 設定用戶資訊
				}
			} catch (error) {
				// 驗證失敗時登出
				console.error('Auth initialization error:', error);
				await logout();
			} finally {
				// 不論成功或失敗都設定 loading 為 false
				setLoading(false);
			}
		};

		initializeAuth(); // 執行驗證
	}, []);

	// 設置 axios 攔截器，處理 token 過期的情況
	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			(response) => response, // 成功的回應直接返回
			async (error) => {
				const originalRequest = error.config;
				const token = localStorage.getItem('accessToken');

				// 當回應為 401 未授權且有 token 時，嘗試重新整理 token
				if (error.response?.status === 401 && !originalRequest._retry && token) {
					originalRequest._retry = true;

					try {
						// 呼叫刷新 token 的 API
						const response = await axios.post(
							`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`
						);

						const { accessToken } = response.data;

						if (accessToken) {
							// 更新 localStorage 和 axios 預設 headers 的 token
							localStorage.setItem('accessToken', accessToken);
							axios.defaults.headers.common[
								'Authorization'
							] = `Bearer ${accessToken}`;
							return axios(originalRequest); // 重新發送原始請求
						}
					} catch (refreshError) {
						// 如果刷新失敗，清除 token 並重導到登入頁
						localStorage.removeItem('accessToken');
						delete axios.defaults.headers.common['Authorization'];
						setUser(null);
						router.push('/login');
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error); // 返回錯誤
			}
		);

		// 在組件卸載時移除攔截器
		return () => {
			axios.interceptors.response.eject(interceptor);
		};
	}, []);

	// 登入方法，保存 token 並設定 user 狀態
	const login = async (accessToken, userData) => {
		localStorage.setItem('accessToken', accessToken);
		setUser(userData);
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
	};

	// 登出方法，清除 token 並重置 user 狀態
	const logout = async (callApi = true) => {
		try {
			if (callApi) {
				// 明確要求時才呼叫登出 API
				await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`);
			}
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			// 確保登出後清除 token 並導向登入頁
			localStorage.removeItem('accessToken');
			localStorage.removeItem('rememberedUser');
			delete axios.defaults.headers.common['Authorization'];
			setUser(null);
			router.push('/login');
		}
	};

	// 更新用戶資料並同步更新 user 狀態
	const updateUser = async (updatedData) => {
		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,
				updatedData
			);
			setUser(response.data.user);
			return response.data;
		} catch (error) {
			throw error;
		}
	};

	// 檢查用戶是否為管理員
	const isAdmin = () => {
		return user?.role === 'admin';
	};

	// 新增檢查用戶是否為商家的方法
	const isShop = () => {
		return user?.role === 'shop';
	};

	// 檢查用戶是否為管理員或商家
	const isAdminOrShop = () => {
		return user?.role === 'admin' || user?.role === 'shop';
	};

	// contextValue 包含用戶相關狀態及方法
	const contextValue = {
		user,
		loading,
		login,
		logout,
		updateUser,
		isAdmin,
		isShop,
		isAdminOrShop
	};

	// 在載入狀態時顯示 loading 指示器
	if (loading) {
		return <div>Loading...</div>;
	}

	// 傳遞 contextValue 給下層元件
	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

// 高階元件 withAuth，用於保護路由，確保用戶登入或具管理員身份才能訪問
export function withAuth(Component, adminOnly = false) {
	return function AuthenticatedComponent(props) {
		const { user, loading, isAdminOrShop } = useUser();
		const router = useRouter();

		useEffect(() => {
			if (!loading && !user) {
				router.push('/login'); // 未登入則導向登入頁
			}
			if (adminOnly && !isAdminOrShop()) {
				router.push('/'); // 非管理員或商家則導向主頁
			}
		}, [user, loading]);

		// 在載入狀態時顯示 loading 指示器
		if (loading) {
			return <div>Loading...</div>;
		}

		return user ? <Component {...props} /> : null; // 如果登入則渲染元件
	};
}
