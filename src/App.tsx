import React, { useEffect } from 'react';
import PageLayout from './components/layout';
import { ConfigProvider } from 'antd';
import useConfigStore from './store/config';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import useUserStore from './store/user';

const App: React.FC = () => {
  const theme = useConfigStore(state => state.themeConfig)
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useUserStore(state => state.isAuthenticated)

  // Handle default route redirect
  useEffect(() => {
    if (location.pathname === '/') {
      if (isAuthenticated) {
        navigate('/demo/table', { replace: true })
      } else {
        navigate('/auth/login', { replace: true })
      }
    }
  }, [location.pathname, isAuthenticated, navigate])

  // Don't show layout for auth pages
  const isAuthPage = location.pathname.startsWith('/auth/')

  return (
    <ConfigProvider theme={{
      algorithm: theme.algorithm,
      token: {
        colorPrimary: theme.primaryColor
      }
    }}>
      {isAuthPage ? <Outlet /> : <PageLayout />}
    </ConfigProvider>
  )
};

export default App;
