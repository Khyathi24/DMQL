import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, DatePicker, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customers = () => {
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
  
  const filteredData = data.filter(customer => 
    customer.CustomerID.toString().includes(searchTerm)
  );
  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/customers', {
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
    values.DateOfBirth = moment(values.DateOfBirth).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    values.SignUpDate = moment(values.SignUpDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    //console.log(values)
    try {
      await axios.post('http://localhost:3001/insertCustomer', values);
      setIsInsertModalVisible(false);
      fetchData(); // Refresh the data after inserting
      toast.success('Success');

    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };
  const handleDelete = async (CustomerId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteCustomer/${CustomerId}`);
      fetchData(); // Refresh the data after deleting
      toast.success('Success');

    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  const columns = [
    {
      title: 'CustomerID',
      dataIndex: 'CustomerID',
      key: 'CustomerID',
    },
    {
      title: 'FirstName',
      dataIndex: 'FirstName',
      key: 'FirstName',
    },
    {
      title: 'LastName',
      dataIndex: 'LastName',
      key: 'LastName',
    },
    {
      title: 'EmailId',
      dataIndex: 'EmailId',
      key: 'EmailId',
    },
    {
      title: 'Location',
      dataIndex: 'Location',
      key: 'Location',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone',
    },
    {
        title: 'Sex',
        dataIndex: 'Sex',
        key: 'Sex',
      },
      {
        title: 'DateOfBirth',
        dataIndex: 'DateOfBirth',
        key: 'DateOfBirth',
      },
      {
        title: 'SignUpDate',
        dataIndex: 'SignUpDate',
        key: 'SignUpDate',
      },
      {
        title: 'LoyalPoints',
        dataIndex: 'LoyalPoints',
        key: 'LoyalPoints',
      },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this Product?"
            onConfirm={() => handleDelete(record.CustomerID)}
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
      await axios.put(`http://localhost:3001/updateCustomer/${values.CustomerID}`, values);
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
          placeholder="Search by CustomerID"
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
          rowKey="CustomerID"
          size="small" // Add this line to set the size to 'small'
          style={{ fontSize: '12px' }} // Adjust the font size
        />
       <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <Button type="primary" onClick={handleInsertClick}>
          Insert Customer
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
            label="CustomerID"
            name="CustomerID"
            rules={[{ required: true, message: 'Please enter the CustomerID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="FirstName"
            name="FirstName"
            rules={[{ required: true, message: 'Please enter the FirstName' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="LastName"
            name="LastName"
            rules={[{ required: true, message: 'Please enter the LastName' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="EmailId"
            name="EmailId"
            rules={[{ required: true, message: 'Please enter the EmailId' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="Location"
            rules={[{ required: true, message: 'Please enter the Location' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Phone"
            name="Phone"
            rules={[{ required: true, message: 'Please enter the Phone' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Sex"
            name="Sex"
            rules={[{ required: true, message: 'Please enter the Sex' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="DateOfBirth"
            name="DateOfBirth"
            rules={[{ required: true, message: 'Please enter the DateOfBirth' }]}
          >
            <DatePicker  format="YYYY-MM-DDTHH:mm:ss.SSSZ" />
          </Form.Item>
          <Form.Item
            label="SignUpDate"
            name="SignUpDate"
            rules={[{ required: true, message: 'Please enter the SignUpDate' }]}
          >
            <DatePicker  format="YYYY-MM-DDTHH:mm:ss.SSSZ" />
          </Form.Item>
          <Form.Item
            label="LoyalPoints"
            name="LoyalPoints"
            rules={[{ required: true, message: 'Please enter the LoyalPoints' }]}
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
            label="CustomerID"
            name="CustomerID"
            rules={[{ required: true, message: 'Please enter the CustomerID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="FirstName"
            name="FirstName"
            rules={[{ required: true, message: 'Please enter the FirstName' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="LastName"
            name="LastName"
            rules={[{ required: true, message: 'Please enter the LastName' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="EmailId"
            name="EmailId"
            rules={[{ required: true, message: 'Please enter the EmailId' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="Location"
            rules={[{ required: true, message: 'Please enter the Location' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Phone"
            name="Phone"
            rules={[{ required: true, message: 'Please enter the Phone' }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Sex"
            name="Sex"
            rules={[{ required: true, message: 'Please enter the Sex' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="LoyalPoints"
            name="LoyalPoints"
            rules={[{ required: true, message: 'Please enter the LoyalPoints' }]}
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

export default Customers;
