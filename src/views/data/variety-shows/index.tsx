import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Tabs, Row, Col, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { VarietyShow } from '../types'
import { getVarietyShows, saveVarietyShows, deleteVarietyShow } from './api'

const { Title } = Typography
const { TextArea } = Input

const VarietyShowsPage = () => {
  const [loading, setLoading] = useState(false)
  const [shows, setShows] = useState<VarietyShow[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingShow, setEditingShow] = useState<VarietyShow | null>(null)
  const [form] = Form.useForm()

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

  const handleEdit = (record: VarietyShow) => {
    setEditingShow(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingShow(null)
    form.resetFields()
    form.setFieldsValue({
      links: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: VarietyShow) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteVarietyShow(record.id)
          setShows(shows.filter(s => s.id !== record.id))
          message.success('Variety show deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete variety show')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingShow) {
        const updatedShows = shows.map(s => (s.id === editingShow.id ? { ...s, ...values } : s))
        await saveVarietyShows(updatedShows)
        setShows(updatedShows)
        message.success('Variety show updated successfully')
      } else {
        const newShow: VarietyShow = {
          ...values,
          id: values.id || Date.now().toString(),
          links: values.links || []
        }
        const updatedShows = [...shows, newShow]
        await saveVarietyShows(updatedShows)
        setShows(updatedShows)
        message.success('Variety show created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save variety show')
    }
  }

  const columns: ColumnsType<VarietyShow> = [
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
          <Title level={3}>Variety Shows Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Variety Show
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={shows}
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
        title={editingShow ? 'Edit Variety Show' : 'Add Variety Show'}
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
                        rules={[{ required: true, message: 'Please input variety show ID' }]}
                      >
                        <Input disabled={!!editingShow} placeholder="Variety Show ID" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please input variety show date' }]}
                      >
                        <Input placeholder="Variety Show Date" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input variety show title' }]}
                      >
                        <Input placeholder="Variety Show Title" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="places"
                        label="Places"
                      >
                        <Input placeholder="Variety Show Places" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                      >
                        <TextArea rows={4} placeholder="Variety Show Description" />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'links',
                label: 'Links',
                children: (
                  <Form.List name="links">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'subtitle']}
                                  label="Subtitle"
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Subtitle" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.List name={[name, 'links']}>
                                  {(linkFields, { add: addLink, remove: removeLink }) => (
                                    <>
                                      {linkFields.map((linkField) => (
                                        <Card key={linkField.key} size="small" style={{ marginBottom: 8, backgroundColor: '#f5f5f5' }}>
                                          <Row gutter={16}>
                                            <Col span={8}>
                                              <Form.Item
                                                {...linkField}
                                                name={[linkField.name, 'link_title']}
                                                label="Link Title"
                                                rules={[{ required: true }]}
                                              >
                                                <Input placeholder="Link Title" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                              <Form.Item
                                                {...linkField}
                                                name={[linkField.name, 'link']}
                                                label="Link URL"
                                                rules={[{ required: true }]}
                                              >
                                                <Input placeholder="Link URL" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                              <Form.Item
                                                {...linkField}
                                                name={[linkField.name, 'icon']}
                                                label="Icon"
                                              >
                                                <Input placeholder="Icon" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                              <Form.Item
                                                {...linkField}
                                                name={[linkField.name, 'metadata', 'video_date']}
                                                label="Video Date"
                                              >
                                                <Input placeholder="Video Date" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                              <Form.Item
                                                {...linkField}
                                                name={[linkField.name, 'metadata', 'songs']}
                                                label="Songs"
                                              >
                                                <Input placeholder="Songs" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                              <Form.Item
                                                {...linkField}
                                                name={[linkField.name, 'metadata', 'desc']}
                                                label="Description"
                                              >
                                                <TextArea rows={2} placeholder="Description" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                              <Button type="link" danger onClick={() => removeLink(linkField.name)}>
                                                <MinusCircleOutlined /> Remove Link
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Card>
                                      ))}
                                      <Button type="dashed" onClick={() => addLink()} block icon={<PlusOutlined />}>
                                        Add Link
                                      </Button>
                                    </>
                                  )}
                                </Form.List>
                              </Col>
                              <Col span={24}>
                                <Button type="link" danger onClick={() => remove(name)}>
                                  <MinusCircleOutlined /> Remove Link Group
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Link Group
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

export default VarietyShowsPage
