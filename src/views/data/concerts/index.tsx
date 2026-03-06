import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Tabs, Row, Col, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, CopyOutlined } from '@ant-design/icons'
import type { Concert } from '../types'
import { getConcerts, saveConcerts, deleteConcert } from './api'

const { Title } = Typography
const { TextArea } = Input

const ConcertsPage = () => {
  const [loading, setLoading] = useState(false)
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null)
  const [pasteModalVisible, setPasteModalVisible] = useState(false)
  const [pasteText, setPasteText] = useState('')
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
    
    const formData = {
      ...record,
      songTimestamps: record.songTimestamps 
        ? Object.entries(record.songTimestamps).map(([songName, timestamp]) => ({
            songName,
            timestamp
          }))
        : []
    }
    
    form.setFieldsValue(formData)
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

  const handlePasteConvert = () => {
    setPasteModalVisible(true)
    setPasteText('')
  }

  const handlePasteSubmit = () => {
    try {
      const parsedTimestamps = parseTimestampsFromText(pasteText)
      if (parsedTimestamps.length === 0) {
        message.warning('No valid timestamps found in the pasted text')
        return
      }

      const currentTimestamps = form.getFieldValue('songTimestamps') || []
      const newTimestamps = [...currentTimestamps, ...parsedTimestamps]
      form.setFieldsValue({ songTimestamps: newTimestamps })

      message.success(`Successfully imported ${parsedTimestamps.length} timestamps`)
      setPasteModalVisible(false)
      setPasteText('')
    } catch (error) {
      console.error('Error parsing timestamps:', error)
      message.error('Failed to parse timestamps. Please check the format.')
    }
  }

  const parseTimestampsFromText = (text: string): Array<{ songName: string; timestamp: string }> => {
    const result: Array<{ songName: string; timestamp: string }> = []

    const lines = text.split('\n')
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      const match = trimmedLine.match(/^['"]?(.+?)['"]?\s*:\s*['"]?([0-9]+:[0-9]+(?::[0-9]+)?)['"]?,?\s*$/)
      if (match) {
        const songName = match[1].trim()
        const timestamp = match[2].trim()
        result.push({ songName, timestamp })
      }
    }

    return result
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const songTimestampsMap = values.songTimestamps?.reduce((acc: Record<string, string>, item: { songName: string; timestamp: string }) => {
        if (item.songName && item.timestamp) {
          acc[item.songName] = item.timestamp
        }
        return acc
      }, {}) || {}
      
      const concertData = {
        ...values,
        songTimestamps: songTimestampsMap
      }
      
      if (editingConcert) {
        const updatedConcerts = concerts.map(c => (c.id === editingConcert.id ? { ...c, ...concertData } : c))
        await saveConcerts(updatedConcerts)
        setConcerts(updatedConcerts)
        message.success('Concert updated successfully')
      } else {
        const newConcert: Concert = {
          ...concertData,
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
              {
                key: 'timestamps',
                label: 'Song Timestamps',
                children: (
                  <Form.List name="songTimestamps">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'songName']}
                                  label="Song Name"
                                  rules={[{ required: true, message: 'Please input song name' }]}
                                >
                                  <Input placeholder="Song Name" />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'timestamp']}
                                  label="Timestamp"
                                  rules={[{ required: true, message: 'Please input timestamp (e.g., 0:03:08)' }]}
                                >
                                  <Input placeholder="Timestamp (e.g., 0:03:08)" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Button type="link" danger onClick={() => remove(name)}>
                                  <MinusCircleOutlined /> Remove Timestamp
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Song Timestamp
                        </Button>
                        <Button 
                          type="primary" 
                          onClick={handlePasteConvert} 
                          block 
                          icon={<CopyOutlined />}
                          style={{ marginTop: 8 }}
                        >
                          Paste & Convert from timeUtils.ts
                        </Button>
                      </>
                    )}
                  </Form.List>
                ),
              },
            ]}
          />
        </Form>

        <Modal
          title="Paste Timestamps from timeUtils.ts"
          open={pasteModalVisible}
          onOk={handlePasteSubmit}
          onCancel={() => {
            setPasteModalVisible(false)
            setPasteText('')
          }}
          width={800}
        >
          <div style={{ marginBottom: 16 }}>
            <p>Copy the timestamp mapping from timeUtils.ts and paste it below. Example format:</p>
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`export const tianjinSongTimestamps: Record<string, string> = {
  '打开（原创）': '0:01:51',
  '没语季节（原创）': '0:09:18',
  '我们的爱（翻唱）': '0:15:12',
}`}
            </pre>
          </div>
          <TextArea
            rows={15}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste the timestamp mapping here..."
          />
        </Modal>
      </Modal>
    </div>
  )
}

export default ConcertsPage
