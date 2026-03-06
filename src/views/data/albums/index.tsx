import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Tabs, Row, Col, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Album } from '../types'
import { getAlbums, saveAlbums } from '../api'

const { Title } = Typography
const { TextArea } = Input

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
    form.setFieldsValue({
      tracks: [],
      awards: [],
      production: { producers: [], musicians: [] }
    })
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
          tracks: values.tracks || [],
          awards: values.awards || [],
          production: values.production || { producers: [], musicians: [] },
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
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Tabs
            defaultActiveKey="basic"
            items={[
              {
                key: 'basic',
                label: 'Basic Info',
                children: (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="id"
                        label="ID"
                        rules={[{ required: true, message: 'Please input album ID' }]}
                      >
                        <Input disabled={!!editingAlbum} placeholder="Album ID" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="slug"
                        label="Slug"
                        rules={[{ required: true, message: 'Please input album slug' }]}
                      >
                        <Input placeholder="Album Slug" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input album title' }]}
                      >
                        <Input placeholder="Album Title" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="artist"
                        label="Artist"
                        rules={[{ required: true, message: 'Please input artist name' }]}
                      >
                        <Input placeholder="Artist Name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please input album type' }]}
                      >
                        <Input placeholder="Album Type" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="label"
                        label="Label"
                      >
                        <Input placeholder="Record Label" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="releaseDate"
                        label="Release Date"
                        rules={[{ required: true, message: 'Please input release date' }]}
                      >
                        <Input placeholder="Release Date" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="physicalReleaseDate"
                        label="Physical Release Date"
                      >
                        <Input placeholder="Physical Release Date" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="coverImage"
                        label="Cover Image"
                      >
                        <Input placeholder="Cover Image URL" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                      >
                        <TextArea rows={4} placeholder="Album Description" />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'tracks',
                label: 'Tracks',
                children: (
                  <Form.List name="tracks">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'id']}
                                  label="Track ID"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Track ID" />
                                </Form.Item>
                              </Col>
                              <Col span={16}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'title']}
                                  label="Title"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Track Title" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'lyricist']}
                                  label="Lyricist"
                                >
                                  <Input placeholder="Lyricist" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'composer']}
                                  label="Composer"
                                >
                                  <Input placeholder="Composer" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'arranger']}
                                  label="Arranger"
                                >
                                  <Input placeholder="Arranger" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'vocalProducer']}
                                  label="Vocal Producer"
                                >
                                  <Input placeholder="Vocal Producer" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'backingVocal']}
                                  label="Backing Vocal"
                                >
                                  <Input placeholder="Backing Vocal" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'harmony']}
                                  label="Harmony"
                                >
                                  <Input placeholder="Harmony" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'masteringProducer']}
                                  label="Mastering Producer"
                                >
                                  <Input placeholder="Mastering Producer" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'duration']}
                                  label="Duration"
                                >
                                  <Input placeholder="Duration" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'audioPath']}
                                  label="Audio Path"
                                >
                                  <Input placeholder="Audio Path" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'qqMusicSongId']}
                                  label="QQ Music ID"
                                >
                                  <Input placeholder="QQ Music Song ID" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'neteaseMusicId']}
                                  label="Netease Music ID"
                                >
                                  <Input placeholder="Netease Music ID" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'description']}
                                  label="Description"
                                >
                                  <TextArea rows={2} placeholder="Track Description" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Button type="link" danger onClick={() => remove(name)}>
                                  <MinusCircleOutlined /> Remove Track
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Track
                        </Button>
                      </>
                    )}
                  </Form.List>
                ),
              },
              {
                key: 'awards',
                label: 'Awards',
                children: (
                  <Form.List name="awards">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'date']}
                                  label="Date"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Date" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'organization']}
                                  label="Organization"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Organization" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'award']}
                                  label="Award"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Award" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Button type="link" danger onClick={() => remove(name)}>
                                  <MinusCircleOutlined /> Remove Award
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Award
                        </Button>
                      </>
                    )}
                  </Form.List>
                ),
              },
              {
                key: 'production',
                label: 'Production',
                children: (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={['production', 'producers']}
                        label="Producers"
                      >
                        <Select mode="tags" placeholder="Add producers" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['production', 'musicians']}
                        label="Musicians"
                      >
                        <Select mode="tags" placeholder="Add musicians" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name={['production', 'visualDesign']}
                        label="Visual Design"
                      >
                        <Input placeholder="Visual Design" />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default AlbumsPage
