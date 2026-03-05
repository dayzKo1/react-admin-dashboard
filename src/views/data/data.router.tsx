import { AdminRouterItem } from '../../router'
import { AppstoreOutlined } from '@ant-design/icons'

const dataRoutes: AdminRouterItem[] = [
  {
    path: 'data',
    meta: {
      label: 'Data Management',
      title: 'Data Management',
      key: '/data',
      icon: <AppstoreOutlined />,
      order: 4,
    },
  },
]

export default dataRoutes
