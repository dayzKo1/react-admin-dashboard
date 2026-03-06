import { AdminRouterItem } from '@/router'
import WeiboCallback from '.'

const weiboCallbackRoutes: AdminRouterItem[] = [
  {
    path: 'auth/weibo/callback',
    element: <WeiboCallback />,
    meta: {
      label: 'Weibo Callback',
      title: 'Weibo OAuth Callback',
      key: '/auth/weibo/callback',
      hideInMenu: true,
    },
  },
]

export default weiboCallbackRoutes
