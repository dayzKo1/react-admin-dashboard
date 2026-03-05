import { AdminRouterItem } from '../../router'
import { AudioOutlined } from '@ant-design/icons'
import ConcertsPage from '.'

const concertsRoutes: AdminRouterItem[] = [
  {
    path: 'data/concerts',
    element: <ConcertsPage />,
    meta: {
      label: 'Concerts',
      title: 'Concerts Management',
      key: '/data/concerts',
      icon: <AudioOutlined />,
      order: 2,
    },
  },
]

export default concertsRoutes
