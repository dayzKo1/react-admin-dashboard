import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Tabs, Row, Col, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Concert } from '../types'
import { getConcerts, saveConcerts, deleteConcert } from './api'

const { Title } = Typography
const { TextArea } = Input

const ConcertsPage = () => {
  const [loading, setLoading] = useState(false)
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null)
  const [form] = Form.useForm()

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

  const handleEdit = (record: Concert) => {
    setEditingConcert(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingConcert(null)
    form.resetFields()
    form.setFieldsValue({
      content: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Concert) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteConcert(record.id)
          setConcerts(concerts.filter(c => c.id !== record.id))
          message.success('Concert deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete concert')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingConcert) {
        const updatedConcerts = concerts.map(c => (c.id === editingConcert.id ? { ...c, ...values } : c))
        await saveConcerts(updatedConcerts)
        setConcerts(updatedConcerts)
        message.success('Concert updated successfully')
      } else {
        const newConcert: Concert = {
          ...values,
          id: values.id || Date.now().toString(),
          content: values.content || []
        }
        const updatedConcerts = [...concerts, newConcert]
        await saveConcerts(updatedConcerts)
        setConcerts(updatedConcerts)
        message.success('Concert created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save concert')
    }
  }

  const columns: ColumnsType<Concert> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
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
          <Title level={3}>Concerts Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Concert
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={concerts}
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
        title={editingConcert ? 'Edit Concert' : 'Add Concert'}
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
                        rules={[{ required: true, message: 'Please input concert ID' }]}
                      >
                        <Input disabled={!!editingConcert} placeholder="Concert ID" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please input concert date' }]}
                      >
                        <Input placeholder="Concert Date" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input concert title' }]}
                      >
                        <Input placeholder="Concert Title" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="places"
                        label="Places"
                        rules={[{ required: true, message: 'Please input concert places' }]}
                      >
                        <Input placeholder="Concert Places" />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'content',
                label: 'Content',
                children: (
                  <Form.List name="content">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'type']}
                                  label="Type"
                                  rules={[{ required: true }]}
                                >
                                  <Select placeholder="Content Type">
                                    <Select.Option value="HeroSection">Hero Section</Select.Option>
                                    <Select.Option value="ContentSection">Content Section</Select.Option>
                                    <Select.Option value="ImageSection">Image Section</Select.Option>
                                    <Select.Option value="ButtonSection">Button Section</Select.Option>
                                    <Select.Option value="SongTabSection">Song Tab Section</Select.Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={16}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'title']}
                                  label="Title"
                                >
                                  <Input placeholder="Title" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'background_image']}
                                  label="Background Image"
                                >
                                  <Input placeholder="Background Image URL" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'button_link']}
                                  label="Button Link"
                                >
                                  <Input placeholder="Button Link URL" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'index']}
                                  label="Index"
                                >
                                  <Input type="number" placeholder="Index" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'content']}
                                  label="Content"
                                >
                                  <TextArea rows={3} placeholder="Content" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Button type="link" danger onClick={() => remove(name)}>
                                  <MinusCircleOutlined /> Remove Content
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Content Section
                        </Button>
                      </>
                    )}
                  </Form.List>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default ConcertsPage
