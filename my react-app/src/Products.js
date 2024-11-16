import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, DatePicker, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
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

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const filteredData = data.filter(product => 
    product.ID.toString().includes(searchTerm)
  );
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products', {
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

    //console.log(values)
    try {
      await axios.post('http://localhost:3001/insertProduct', values);
      setIsInsertModalVisible(false);
      fetchData(); // Refresh the data after inserting
      toast.success('Success');

    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteProduct/${orderId}`);
      fetchData(); // Refresh the data after deleting
      toast.success('Success');

    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: 'ProductID',
      dataIndex: 'ProductID',
      key: 'ProductID',
    },
    {
      title: 'SupplierID',
      dataIndex: 'SupplierID',
      key: 'SupplierID',
    },
    {
      title: 'ProductName',
      dataIndex: 'ProductName',
      key: 'ProductName',
    },
    {
      title: 'ProductPrice',
      dataIndex: 'ProductPrice',
      key: 'ProductPrice',
    },
    {
      title: 'StockLevel',
      dataIndex: 'StockLevel',
      key: 'StockLevel',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this Product?"
            onConfirm={() => handleDelete(record.ID)}
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
      await axios.put(`http://localhost:3001/updateProduct/${values.ID}`, values);
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
          placeholder="Search by ProductID"
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
          Insert Product
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
            label="ID"
            name="ID"
            rules={[{ required: true, message: 'Please enter the ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ProductID"
            name="ProductID"
            rules={[{ required: true, message: 'Please enter the ProductID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="SupplierID"
            name="SupplierID"
            rules={[{ required: true, message: 'Please enter the SupplierID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ProductName"
            name="ProductName"
            rules={[{ required: true, message: 'Please enter the ProductName' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="ProductPrice"
            name="ProductPrice"
            rules={[{ required: true, message: 'Please enter the ProductPrice' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="StockLevel"
            name="StockLevel"
            rules={[{ required: true, message: 'Please enter the StockLevel' }]}
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
            label="ID"
            name="ID"
            rules={[{ required: true, message: 'Please enter the ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ProductID"
            name="ProductID"
            rules={[{ required: true, message: 'Please enter the ProductID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="SupplierID"
            name="SupplierID"
            rules={[{ required: true, message: 'Please enter the SupplierID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ProductName"
            name="ProductName"
            rules={[{ required: true, message: 'Please enter the ProductName' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ProductPrice"
            name="ProductPrice"
            rules={[{ required: true, message: 'Please enter the ProductPrice' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="StockLevel"
            name="StockLevel"
            rules={[{ required: true, message: 'Please enter the StockLevel' }]}
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

export default Products;
