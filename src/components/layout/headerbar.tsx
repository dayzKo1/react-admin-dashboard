import { Layout, Switch, Dropdown, Avatar } from 'antd';
import { GithubOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import useConfigStore from '../../store/config';
import useUserStore from '../../store/user';
import { useNavigate } from 'react-router-dom';
const { Header } = Layout;

const Headerbar = (props: { colorBgContainer: string }) => {
  const themeConfig = useConfigStore(state => state.themeConfig)
  const setAlgorithm = useConfigStore(state => state.setAlgorithm)
  const setCompactAlgorithm = useConfigStore(state => state.setCompactAlgorithm)
  const user = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logout)
  const navigate = useNavigate()

  // Get current theme mode (default or dark)
  const isDarkMode = themeConfig._algorithm.includes('dark')
  const isCompactMode = themeConfig._algorithm.includes('compact')

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Header title='React Admin Dashboard' style={{ padding: 0, background: props.colorBgContainer }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: "0 20px", justifyContent: 'space-between' }}>
        <h2>React Admin Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Switch 
            checkedChildren="Light" 
            unCheckedChildren="Dark" 
            checked={!isDarkMode}
            onChange={(checked) => setAlgorithm(checked ? 'default' : 'dark')} 
          />
          <Switch 
            checkedChildren="Compact" 
            unCheckedChildren="Loose" 
            checked={isCompactMode}
            onChange={(checked) => setCompactAlgorithm(checked ? 'compact' : '')} 
          />
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '0 8px' }}>
                <Avatar 
                  src={user.avatar} 
                  icon={!user.avatar && <UserOutlined />}
                  size="small"
                />
                <span>{user.username}</span>
              </div>
            </Dropdown>
          )}
          <GithubOutlined style={{ fontSize: 30, cursor: 'pointer' }} onClick={() => window.open('https://github.com/larry-xue/react-admin-dashboard')} />
        </div>
      </div>
    </Header>
  )
}

export default Headerbar
