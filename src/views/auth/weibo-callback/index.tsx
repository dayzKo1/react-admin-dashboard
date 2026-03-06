import React, { useEffect, useState } from 'react'
import { Spin, Result, Button, message, Modal } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useUserStore from '@/store/user'

const WeiboCallback: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  const parseExpiry = (raw: string | null): number | null => {
    if (!raw) return null
    const numeric = Number(raw)
    if (!Number.isFinite(numeric) || numeric <= 0) return null
    return numeric < 1_000_000_000_000 ? numeric * 1000 : numeric
  }

  const decodeJwtExpiry = (token: string): number | null => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as {
        exp?: number
      }
      if (typeof payload.exp === 'number') {
        return payload.exp * 1000
      }
    } catch (err) {
      console.warn('[WeiboCallback] Failed to decode JWT exp:', err)
    }
    return null
  }

  const verifySession = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 403) {
        const data = await response.json().catch(() => ({}))
        const errorMessage = data?.message || 'Access denied'
        if (errorMessage.includes('blacklist') || errorMessage.includes('黑名单')) {
          Modal.error({
            title: '登录受限',
            content: '你的账号已被加入黑名单，无法登录。',
            okText: '确认',
            onOk: () => {
              logout()
              navigate('/auth/login')
            }
          })
          return false
        }
      }
      
      if (response.status === 404) {
        console.warn('[WeiboCallback] /me returned 404 for current user')
        return false
      }
      
      if (!response.ok) {
        console.warn('[WeiboCallback] /me returned non-OK:', response.status)
        return false
      }
      
      const userData = await response.json()
      return true
    } catch (err) {
      console.error('[WeiboCallback] Failed to call /me:', err)
      return false
    }
  }

  useEffect(() => {
    const handleWeiboCallback = async () => {
      const errorParam = searchParams.get('error')
      
      if (errorParam) {
        setError(errorParam)
        message.error(`登录失败：${errorParam}`)
        setLoading(false)
        return
      }

      const token = searchParams.get('token')
      const expiresRaw = searchParams.get('expires_at') || searchParams.get('expiresAt') || searchParams.get('exp')
      const paramExpiry = parseExpiry(expiresRaw ?? null)
      const jwtExpiry = token ? decodeJwtExpiry(token) : null
      const expiresAt = paramExpiry && jwtExpiry ? Math.min(paramExpiry, jwtExpiry) : paramExpiry || jwtExpiry

      if (!token || !expiresAt) {
        setError('登录回调缺少有效的过期时间或 token')
        message.error('登录回调缺少有效的过期时间或 token')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        const isValidSession = await verifySession(token)
        
        if (!isValidSession) {
          setError('会话验证失败')
          message.error('会话验证失败')
          setLoading(false)
          return
        }
        
        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user information')
        }
        
        const userData = await userResponse.json()
        
        const user = {
          id: userData.uid,
          username: userData.nickname,
          email: userData.email || '',
          avatar: userData.avatarUri,
          weiboId: userData.uid
        }
        
        login(user, token)
        message.success('登录成功！')
        navigate('/dashboard')
      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'message' in err 
          ? String(err.message) 
          : '微博登录失败'
        setError(errorMessage)
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    handleWeiboCallback()
  }, [searchParams, navigate, login, logout])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <Spin size="large" />
        <p>正在使用微博登录...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Result
          status="error"
          title="微博登录失败"
          subTitle={error}
          extra={[
            <Button type="primary" key="login" onClick={() => navigate('/auth/login')}>
              返回登录
            </Button>,
          ]}
        />
      </div>
    )
  }

  return null
}

export default WeiboCallback
