import React, { useEffect, useState } from 'react'
import { Spin, Result, Button, message } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useUserStore from '@/store/user'

const WeiboCallback: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useUserStore((state) => state.login)

  useEffect(() => {
    const handleWeiboCallback = async () => {
      const token = searchParams.get('token')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        setError(errorParam)
        setLoading(false)
        return
      }

      if (!token) {
        setError('No token found in callback')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
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
          avatar: userData.avatar,
          weiboId: userData.weiboId
        }
        
        login(user, token)
        message.success('Login successful!')
        navigate('/dashboard')
      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'message' in err 
          ? String(err.message) 
          : 'Weibo login failed'
        setError(errorMessage)
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    handleWeiboCallback()
  }, [searchParams, navigate, login])

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
        <p>Logging in with Weibo...</p>
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
          title="Weibo Login Failed"
          subTitle={error}
          extra={[
            <Button type="primary" key="login" onClick={() => navigate('/auth/login')}>
              Back to Login
            </Button>,
          ]}
        />
      </div>
    )
  }

  return null
}

export default WeiboCallback
