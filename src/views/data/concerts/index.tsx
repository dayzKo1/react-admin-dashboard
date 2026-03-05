import { useEffect, useState } from 'react'
import { Card, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Concert } from '../types'
import { getConcerts } from './api'

const { Title } = Typography

const ConcertsPage = () => {
  const [loading, setLoading] = useState(false)
  const [concerts, setConcerts] = useState<Concert[]>([])

  const loadConcerts = async () => {
    setLoading(true)
    try {
      const response = await getConcerts()
      setConcerts(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load concerts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConcerts()
  }, [])

  const columns: ColumnsType<Concert> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Places',
      dataIndex: 'places',
      key: 'places',
    },
    {
      title: 'Content Sections',
      dataIndex: 'content',
      key: 'content',
      render: (content) => content?.length || 0,
    },
  ]

  return (
    <div>
      <Card>
        <Title level={3} style={{ marginBottom: 16 }}>
          Concerts Management
        </Title>
        <Table
          columns={columns}
          dataSource={concerts}
          rowKey={(record, index) => index?.toString() || ''}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>
    </div>
  )
}

export default ConcertsPage
