import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Album } from '../types'
import { getAlbums, saveAlbums } from '../api'

const { Title } = Typography

const AlbumsPage = () => {
  const [loading, setLoading] = useState(false)
  const [albums, setAlbums] = useState<Album[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [form] = Form.useForm()

  const loadAlbums = async () => {
    setLoading(true)
    try {
      const response = await getAlbums()
      setAlbums(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load albums. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlbums()
  }, [])

  const handleEdit = (record: Album) => {
    setEditingAlbum(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingAlbum(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleDelete = async (record: Album) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedAlbums = albums.filter(a => a.id !== record.id)
          await saveAlbums(updatedAlbums)
          setAlbums(updatedAlbums)
          message.success('Album deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete album')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingAlbum) {
        const updatedAlbums = albums.map(a => (a.id === editingAlbum.id ? { ...a, ...values } : a))
        await saveAlbums(updatedAlbums)
        setAlbums(updatedAlbums)
        message.success('Album updated successfully')
      } else {
        const newAlbum: Album = {
          ...values,
          tracks: [],
          awards: [],
          production: { producers: [], musicians: [] },
        }
        const updatedAlbums = [...albums, newAlbum]
        await saveAlbums(updatedAlbums)
        setAlbums(updatedAlbums)
        message.success('Album created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save album')
    }
  }

  const columns: ColumnsType<Album> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Release Date',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
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
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
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
          <Title level={3}>Albums Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Album
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={albums}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={editingAlbum ? 'Edit Album' : 'Add Album'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: 'Please input album ID' }]}
          >
            <Input disabled={!!editingAlbum} placeholder="Album ID" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input album title' }]}
          >
            <Input placeholder="Album Title" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please input album slug' }]}
          >
            <Input placeholder="Album Slug" />
          </Form.Item>
          <Form.Item
            name="artist"
            label="Artist"
            rules={[{ required: true, message: 'Please input artist name' }]}
          >
            <Input placeholder="Artist Name" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please input album type' }]}
          >
            <Input placeholder="Album Type" />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: 'Please input release date' }]}
          >
            <Input placeholder="Release Date" />
          </Form.Item>
          <Form.Item
            name="label"
            label="Label"
          >
            <Input placeholder="Record Label" />
          </Form.Item>
          <Form.Item
            name="coverImage"
            label="Cover Image"
          >
            <Input placeholder="Cover Image URL" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Album Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AlbumsPage
