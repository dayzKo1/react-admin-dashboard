import { AdminRouterItem } from '../../router'
import { DatabaseOutlined } from '@ant-design/icons'
import AlbumsPage from '.'

const albumsRoutes: AdminRouterItem[] = [
  {
    path: 'data/albums',
    element: <AlbumsPage />,
    meta: {
      label: 'Albums',
      title: 'Albums Management',
      key: '/data/albums',
      icon: <DatabaseOutlined />,
      order: 1,
    },
  },
]

export default albumsRoutes
