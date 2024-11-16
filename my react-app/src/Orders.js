import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, DatePicker, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Orders = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isInsertModalVisible, setIsInsertModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [insertForm] = Form.useForm();

  const filteredData = data.filter(order => 
    order.OrderID.toString().includes(searchTerm)
  );
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/test-db', {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      });

      setData(response.data.data);
      setPagination(p => ({
        ...p,
        total: response.data.total,
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleInsertClick = () => {
    setIsInsertModalVisible(true);
  };

  const handleInsertCancel = () => {
    setIsInsertModalVisible(false);
  };

  const handleInsertFinish = async (values) => {
    values.OrderDate = moment(values.OrderDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    //console.log(values)
    try {
      await axios.post('http://localhost:3001/insertOrder', values);
      setIsInsertModalVisible(false);
      fetchData(); // Refresh the data after inserting
      toast.success('Success');

    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteOrder/${orderId}`);
      fetchData(); // Refresh the data after deleting
      toast.success('Success');

    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  const columns = [
    {
      title: 'OrderID',
      dataIndex: 'OrderID',
      key: 'OrderID',
    },
    {
      title: 'CustomerID',
      dataIndex: 'CustomerID',
      key: 'CustomerID',
    },
    {
      title: 'TotalAmount',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
    },
    {
      title: 'OrderDate',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this order?"
            onConfirm={() => handleDelete(record.OrderID)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
        </Space>
      ),
    },
  ];
  const handleEditClick = (record) => {
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditFinish = async (values) => {

    try {
      await axios.put(`http://localhost:3001/updateOrder/${values.OrderID}`, values);
      setIsEditModalVisible(false);
      fetchData();
      toast.success('Success');

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div>
         <div style={{ margin: 16 }}>
        <Input
          placeholder="Search by OrderID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
      </div>
        
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="OrderID"
          size="small" // Add this line to set the size to 'small'
          style={{ fontSize: '12px' }} // Adjust the font size
        />
       <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <Button type="primary" onClick={handleInsertClick}>
          Insert Order
        </Button>
      </div>

      <Modal
        title="Insert Data"
        visible={isInsertModalVisible}
        onCancel={handleInsertCancel}
        footer={null}
      >
        <Form form={insertForm} onFinish={handleInsertFinish}>
          <Form.Item
            label="OrderID"
            name="OrderID"
            rules={[{ required: true, message: 'Please enter the OrderID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CustomerID"
            name="CustomerID"
            // rules={[{ required: true, message: 'Please enter the CustomerID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="TotalAmount"
            name="TotalAmount"
            rules={[{ required: true, message: 'Please enter the TotalAmount' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="OrderDate"
            name="OrderDate"
            rules={[{ required: true, message: 'Please enter the OrderDate' }]}
          >
            <DatePicker  format="YYYY-MM-DDTHH:mm:ss.SSSZ" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="Status"
            rules={[{ required: true, message: 'Please enter the Status' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Data"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditFinish}>
          <Form.Item
            label="OrderID"
            name="OrderID"
            rules={[{ required: true, message: 'Please enter the OrderID' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="CustomerID"
            name="CustomerID"
            rules={[{ required: true, message: 'Please enter the CustomerID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="TotalAmount"
            name="TotalAmount"
            rules={[{ required: true, message: 'Please enter the TotalAmount' }]}
          >
            <InputNumber />
          </Form.Item>
          {/* <Form.Item
            label="OrderDate"
            name="OrderDate"
            rules={[{ required: true, message: 'Please enter the OrderDate' }]}
          >
            <DatePicker  format="YYYY-MM-DDTHH:mm:ss.SSSZ" />

          </Form.Item> */}
          <Form.Item
            label="Status"
            name="Status"
            rules={[{ required: true, message: 'Please enter the Status' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
