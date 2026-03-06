import { AdminRouterItem } from '../../router'
import { DatabaseOutlined } from '@ant-design/icons'

const dataRoutes: AdminRouterItem[] = [
  {
    path: 'data',
    meta: {
      label: 'Data Management',
      title: 'Data Management',
      key: '/data',
      icon: <DatabaseOutlined />,
      order: 4,
    },
  },
]

export default dataRoutes
