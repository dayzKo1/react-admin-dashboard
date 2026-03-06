import { useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Statistic, Typography, theme, Empty } from 'antd'
import { CustomerServiceOutlined, AudioOutlined, TeamOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { request } from '@/utils/api'

interface DataCount {
  albums: number
  concerts: number
  members: number
  varietyShows: number
}

const DashboardPage = () => {
  const [dataCount, setDataCount] = useState<DataCount>({
    albums: 0,
    concerts: 0,
    members: 0,
    varietyShows: 0,
  })
  const [loading, setLoading] = useState(true)
  const { token } = theme.useToken()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [albumsRes, concertsRes, teamRes, varietyShowsRes] = await Promise.all([
          request.get('/api/data/albums'),
          request.get('/api/data/concerts'),
          request.get('/api/data/team'),
          request.get('/api/data/variety-shows'),
        ])

        setDataCount({
          albums: albumsRes.data?.length || 0,
          concerts: concertsRes.data?.length || 0,
          members: teamRes.data?.members?.length || 0,
          varietyShows: varietyShowsRes.data?.length || 0,
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const metricCards = useMemo(() => ([
    {
      title: 'Albums',
      value: dataCount.albums,
      suffix: 'albums',
      icon: <CustomerServiceOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
      color: '#1890ff',
    },
    {
      title: 'Concerts',
      value: dataCount.concerts,
      suffix: 'concerts',
      icon: <AudioOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
      color: '#52c41a',
    },
    {
      title: 'Team Members',
      value: dataCount.members,
      suffix: 'members',
      icon: <TeamOutlined style={{ color: '#fa8c16', fontSize: 24 }} />,
      color: '#fa8c16',
    },
    {
      title: 'Variety Shows',
      value: dataCount.varietyShows,
      suffix: 'shows',
      icon: <VideoCameraOutlined style={{ color: '#722ed1', fontSize: 24 }} />,
      color: '#722ed1',
    },
  ]), [dataCount])

  const metricCardStyle = {
    background: token.colorBgElevated,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    height: '100%',
  }

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Typography.Title>
      
      <Row gutter={[16, 16]}>
        {metricCards.map(card => (
          <Col key={card.title} xs={24} sm={12} lg={6}>
            <Card 
              styles={{ body: { padding: 24 } }} 
              style={metricCardStyle}
              hoverable
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: '50%', 
                  backgroundColor: `${card.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <Statistic
                    title={card.title}
                    value={card.value}
                    suffix={card.suffix}
                    valueStyle={{ 
                      color: token.colorText,
                      fontSize: 28,
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card 
            title="Welcome to 17b331 Admin"
            style={metricCardStyle}
          >
            <div style={{ padding: 24, textAlign: 'center' }}>
              <Empty
                description={
                  <div>
                    <Typography.Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                      Manage your data efficiently with the 17b331 Admin Dashboard
                    </Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Use the navigation menu to access Albums, Concerts, Team, and Variety Shows management
                    </Typography.Text>
                  </div>
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
