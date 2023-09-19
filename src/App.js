// import logo from './logo.svg';
import React, { useState } from 'react';

import './App.scss';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  Layout,
  Row,
  Col,
  Card,
  TimePicker,
  Space, Table, Tag, Typography
} from 'antd';
import {
  Popconfirm,
  Divider,
} from "antd";
import "antd/dist/antd-with-locales";
// import form from "./form/index";

// import type { ColumnsType } from 'antd/es/table';

// interface DataType {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
//   tags: string[];
// }

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
// const originData = [];
// for (let i = 0; i < 3; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }
const originData = [
  {
    key: "1",
    name: "John Brown",
    code: "00001",
    address: "New York No. 1 Lake Park"
  },
  {
    key: "2",
    name: "Jim Green",
    code: "00002",
    address: "London No. 1 Lake Park"
  },
  {
    key: "3",
    name: "Joe Black",
    code: "00003",
    address: "Sidney No. 1 Lake Park"
  }
]
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function App() {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      code: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const deleteRow = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }
  const columns = [
    {
      title: '成员姓名',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: '工号',
      dataIndex: 'code',
      width: '15%',
      editable: true,
    },
    {
      title: '所属部门',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link
              onClick={() => deleteRow(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Delete
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <div className='header'>
        <div className='path'>
          Form/ Advanced Form
        </div>
        <div className='title'>
          Advanced Form
        </div>
        <div className='sub-title'>
          高级表单常见于一次性输入和提交大批量数据的场景。
        </div>
      </div>
      <div className='layout'>
        <Card title="仓库管理" className='layout_form'>
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={"仓库名"} rules={[{ required: true }]}>
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item name={['user', 'email']} label="仓库域名" rules={[{ required: true }]}>
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="http://"
                    addonAfter=".com"
                    placeholder="请输入"

                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="仓库管理员" rules={[{ required: true }]}>
                  <Select placeholder="请选择管理员">
                    <Option value="xiao">付晓晓</Option>
                    <Option value="mao">周毛毛</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="审批人" rules={[{ required: true }]}>
                  <Select placeholder="请选择审批员">
                    <Option value="xiao">付晓晓</Option>
                    <Option value="mao">周毛毛</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="生效日期" rules={[{ required: true }]}>
                  <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="仓库类型" rules={[{ required: true }]}>
                  <Select placeholder="请选择仓库类型">
                    <Option value="private">私密</Option>
                    <Option value="public">公开</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="任务管理" className='layout_form'>
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="仓库名" rules={[{ required: true }]}>
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="任务描述" rules={[{ required: true }]}>
                  <Input
                    style={{ width: '100%' }}
                    // addonBefore="http://"
                    // addonAfter=".com"
                    placeholder="Please enter"
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="仓库管理员" rules={[{ required: true }]}>
                  <Select placeholder="请选择管理员">
                    <Option value="xiao">付晓晓</Option>
                    <Option value="mao">周毛毛</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="审批人" rules={[{ required: true }]}>
                  <Select placeholder="请选择审批员">
                    <Option value="xiao">付晓晓</Option>
                    <Option value="mao">周毛毛</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="生效日期">
                  <TimePicker className='w-full'
                  // onChange={onChange} 
                  // defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} 
                  />
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="仓库类型" rules={[{ required: true }]}>
                  <Select placeholder="请选择仓库类型">
                    <Option value="private">私密</Option>
                    <Option value="public">公开</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="成员管理" bordered={false} className='layout_form'>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              // bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              // pagination={{
              //   onChange: cancel,
              // }}
              pagination={false}
            />
          </Form>
          <Button
            type="dashed"
          >
            + 新增成员
          </Button>
        </Card>
      </div>
    </div>


  );
};