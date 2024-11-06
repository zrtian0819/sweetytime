import React, { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 初始化檢查登入狀態
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 檢查 localStorage 中的 token
        const token = localStorage.getItem('accessToken')
        
        if (token) {
          // 設置 axios 預設 headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // 可選：驗證 token 的有效性
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/verify`)
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        await logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // 設置 axios 攔截器處理 token 過期
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // 如果是 401 錯誤且不是重試請求
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // 嘗試刷新 token
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`
            )
            
            const { accessToken } = response.data
            
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken)
              axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
              
              // 重試原始請求
              return axios(originalRequest)
            }
          } catch (refreshError) {
            // token 刷新失敗，登出用戶
            await logout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )

    // 清理函數
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  // 登入
  const login = async (token, userData) => {
    localStorage.setItem('accessToken', token)
    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // 登出
  const logout = async () => {
    try {
      // 呼叫後端登出 API（如果有的話）
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      router.push('/login')
    }
  }

  // 更新用戶資料
  const updateUser = async (updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,
        updatedData
      )
      setUser(response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // 檢查是否為管理員
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const contextValue = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAdmin,
  }

  if (loading) {
    // 可以返回一個 loading 指示器
    return <div>Loading...</div>
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

// 可選：保護路由的 HOC
export function withAuth(Component, adminOnly = false) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useUser()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
      if (adminOnly && !isAdmin()) {
        router.push('/')
      }
    }, [user, loading])

    if (loading) {
      return <div>Loading...</div>
    }

    return user ? <Component {...props} /> : null
  }
}