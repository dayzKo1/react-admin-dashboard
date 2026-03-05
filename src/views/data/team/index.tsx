import { useEffect, useState } from 'react'
import { Card, Table, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Team, Member } from '../types'
import { getTeam } from './api'

const { Title } = Typography

const TeamPage = () => {
  const [loading, setLoading] = useState(false)
  const [team, setTeam] = useState<Team | null>(null)

  const loadTeam = async () => {
    setLoading(true)
    try {
      const response = await getTeam()
      setTeam(response.data)
    } catch (error) {
      console.error(error)
      message.error('Failed to load team. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  const columns: ColumnsType<Member> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <div>
      <Card>
        <Title level={3} style={{ marginBottom: 16 }}>
          Team Management
        </Title>
        {team && (
          <>
            <Typography.Paragraph style={{ marginBottom: 24 }}>
              <strong>Team Name:</strong> {team.name}
            </Typography.Paragraph>
            <Table
              columns={columns}
              dataSource={team.members}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} members`,
              }}
            />
          </>
        )}
      </Card>
    </div>
  )
}

export default TeamPage
