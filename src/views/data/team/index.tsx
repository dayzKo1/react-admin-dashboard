import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Row, Col, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Team, Member } from '../types'
import { getTeam, saveTeam } from './api'

const { Title } = Typography
const { TextArea } = Input

const TeamPage = () => {
  const [loading, setLoading] = useState(false)
  const [team, setTeam] = useState<Team | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editingTeam, setEditingTeam] = useState(false)
  const [form] = Form.useForm()

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

  const handleEditTeam = () => {
    if (team) {
      setEditingTeam(true)
      setEditingMember(null)
      form.setFieldsValue({
        name: team.name,
        background: team.background
      })
      setModalVisible(true)
    }
  }

  const handleEditMember = (record: Member) => {
    setEditingTeam(false)
    setEditingMember(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAddMember = () => {
    setEditingTeam(false)
    setEditingMember(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleDeleteMember = async (record: Member) => {
    if (!team) return
    
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedTeam = {
            ...team,
            members: team.members.filter(m => m.id !== record.id)
          }
          await saveTeam(updatedTeam)
          setTeam(updatedTeam)
          message.success('Member deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete member')
        }
      },
    })
  }

  const handleSubmitTeam = async () => {
    try {
      const values = await form.validateFields()
      if (team) {
        const updatedTeam = {
          ...team,
          name: values.name,
          background: values.background || []
        }
        await saveTeam(updatedTeam)
        setTeam(updatedTeam)
        message.success('Team updated successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save team')
    }
  }

  const handleSubmitMember = async () => {
    try {
      const values = await form.validateFields()
      if (!team) return
      
      if (editingMember) {
        const updatedTeam = {
          ...team,
          members: team.members.map(m => m.id === editingMember.id ? { ...m, ...values } : m)
        }
        await saveTeam(updatedTeam)
        setTeam(updatedTeam)
        message.success('Member updated successfully')
      } else {
        const newMember: Member = {
          ...values,
          id: Date.now()
        }
        const updatedTeam = {
          ...team,
          members: [...team.members, newMember]
        }
        await saveTeam(updatedTeam)
        setTeam(updatedTeam)
        message.success('Member created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save member')
    }
  }

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
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditMember(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMember(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Team Management</Title>
          <Space>
            <Button onClick={handleEditTeam}>
              Edit Team Info
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMember}>
              Add Member
            </Button>
          </Space>
        </div>
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

      <Modal
        title={editingTeam ? 'Edit Team Info' : (editingMember ? 'Edit Member' : 'Add Member')}
        open={modalVisible}
        onOk={editingTeam ? handleSubmitTeam : handleSubmitMember}
        onCancel={() => {
          setModalVisible(false)
          setEditingMember(null)
          setEditingTeam(false)
          form.resetFields()
        }}
        width={600}
      >
        {editingTeam ? (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Team Name"
              rules={[{ required: true, message: 'Please input team name' }]}
            >
              <Input placeholder="Team Name" />
            </Form.Item>
            <Form.Item
              name="background"
              label="Background Images"
            >
              <Select mode="tags" placeholder="Add background image URLs" />
            </Form.Item>
          </Form>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input member name' }]}
            >
              <Input placeholder="Member Name" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please input member role' }]}
            >
              <Input placeholder="Member Role" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image URL"
            >
              <Input placeholder="Member Image URL" />
            </Form.Item>
            <Form.Item
              name="link"
              label="Link"
            >
              <Input placeholder="Member Profile Link" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} placeholder="Member Description" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default TeamPage
