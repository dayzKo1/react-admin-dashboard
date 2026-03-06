import { AdminRouterItem } from '../../router'
import { CustomerServiceOutlined } from '@ant-design/icons'
import AlbumsPage from '.'

const albumsRoutes: AdminRouterItem[] = [
  {
    path: 'data/albums',
    element: <AlbumsPage />,
    meta: {
      label: 'Albums',
      title: 'Albums Management',
      key: '/data/albums',
      icon: <CustomerServiceOutlined />,
      order: 1,
    },
  },
]

export default albumsRoutes
