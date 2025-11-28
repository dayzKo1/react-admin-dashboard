import { Breadcrumb } from 'antd'
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { useEffect, useMemo, useState } from 'react'
import { useMatches } from 'react-router-dom'
import type { AdminRouterItem } from '../../router'
import { routes } from '../../router'
import { assign } from 'lodash-es'

const flattenRoutes = (routeList: AdminRouterItem[], prefix = '/') => {
  let map: Record<string, { path: string; title: string }> = {}

  routeList.forEach(itm => {
    if (!itm.meta?.title || !itm.path) return
    map[prefix + itm.path] = {
      path: prefix + itm.path,
      title: itm.meta.title,
    }

    if (itm.children) {
      map = assign({}, map, flattenRoutes(itm.children, `${prefix}${itm.path}/`))
    }
  })

  return map
}

const PageBreadcrumb: React.FC = () => {
  const matches = useMatches()
  const flattenedRoutes = useMemo(() => flattenRoutes(routes), [])
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([])

  useEffect(() => {
    setBreadcrumbs(
      matches.map(match => ({
        title: flattenedRoutes[match.pathname]?.title ?? match.pathname,
      })),
    )
  }, [matches, flattenedRoutes])

  return <Breadcrumb style={{ margin: '16px 20px' }} items={breadcrumbs} />
}

export default PageBreadcrumb
