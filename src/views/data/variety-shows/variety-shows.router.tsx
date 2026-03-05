import { AdminRouterItem } from '../../router'
import { VideoCameraOutlined } from '@ant-design/icons'
import VarietyShowsPage from '.'

const varietyShowsRoutes: AdminRouterItem[] = [
  {
    path: 'data/variety-shows',
    element: <VarietyShowsPage />,
    meta: {
      label: 'Variety Shows',
      title: 'Variety Shows Management',
      key: '/data/variety-shows',
      icon: <VideoCameraOutlined />,
      order: 4,
    },
  },
]

export default varietyShowsRoutes
