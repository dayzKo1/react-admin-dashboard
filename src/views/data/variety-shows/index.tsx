import { useEffect, useState } from 'react'
import { Card, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { VarietyShow } from '../types'
import { getVarietyShows } from './api'

const { Title } = Typography

const VarietyShowsPage = () => {
  const [loading, setLoading] = useState(false)
  const [shows, setShows] = useState<VarietyShow[]>([])

  const loadShows = async () => {
    setLoading(true)
    try {
      const response = await getVarietyShows()
      setShows(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load variety shows. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShows()
  }, [])

  const columns: ColumnsType<VarietyShow> = [
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => description || '-',
    },
    {
      title: 'Places',
      dataIndex: 'places',
      key: 'places',
      render: (places) => places || '-',
    },
    {
      title: 'Link Groups',
      dataIndex: 'links',
      key: 'links',
      render: (links) => links?.length || 0,
    },
  ]

  return (
    <div>
      <Card>
        <Title level={3} style={{ marginBottom: 16 }}>
          Variety Shows Management
        </Title>
        <Table
          columns={columns}
          dataSource={shows}
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

export default VarietyShowsPage
