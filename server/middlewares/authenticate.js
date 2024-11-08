import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config.js'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export default function authenticate(req, res, next) {
  try {
    // 支援多種 token 傳遞方式
    let token = req.cookies.accessToken // 從 cookie 獲取
    
    // 如果 cookie 中沒有，則檢查 Authorization header
    if (!token) {
      const authHeader = req.headers['authorization']
      token = authHeader && authHeader.split(' ')[1] // Bearer Token
    }

    // 如果都沒有 token
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: '授權失敗，沒有存取令牌',
      })
    }

    // 驗證 token
    jsonwebtoken.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        // 區分不同的錯誤類型
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            status: 'error',
            message: '存取令牌已過期，請重新登入',
          })
        }
        
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({
            status: 'error',
            message: '不合法的存取令牌',
          })
        }

        // 其他錯誤
        return res.status(403).json({
          status: 'error',
          message: '令牌驗證失敗',
        })
      }

      // token 驗證成功
      req.user = user
      next()
    })
  } catch (error) {
    // 捕獲意外的錯誤
    console.error('Authentication error:', error)
    return res.status(500).json({
      status: 'error',
      message: '認證過程發生錯誤',
    })
  }
}

// 可選：新增一個檢查管理員權限的中介軟體
export function authenticateAdmin(req, res, next) {
  authenticate(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next()
    } else {
      res.status(403).json({
        status: 'error',
        message: '需要管理員權限',
      })
    }
  })
}

// 可選：新增一個刷新 token 的函數
export function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({
      status: 'error',
      message: '無法刷新令牌，請重新登入',
    })
  }

  try {
    const user = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    // 生成新的 access token
    const newAccessToken = jsonwebtoken.sign(
      {
        id: user.id,
        role: user.role,
        account: user.account,
      },
      accessTokenSecret,
      { expiresIn: '1h' }
    )

    // 設置新的 cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1小時
    })

    return res.json({
      status: 'success',
      message: '令牌已刷新',
    })
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: '刷新令牌無效或已過期',
    })
  }
}