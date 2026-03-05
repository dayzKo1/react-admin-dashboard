import { AdminRouterItem } from '../../router'
import { TeamOutlined } from '@ant-design/icons'
import TeamPage from '.'

const teamRoutes: AdminRouterItem[] = [
  {
    path: 'data/team',
    element: <TeamPage />,
    meta: {
      label: 'Team',
      title: 'Team Management',
      key: '/data/team',
      icon: <TeamOutlined />,
      order: 3,
    },
  },
]

export default teamRoutes
