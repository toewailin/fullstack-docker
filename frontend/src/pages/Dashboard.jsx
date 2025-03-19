import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Table, Input, Select, Button, Tooltip, Popconfirm, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const items = [
  { key: '1', icon: <UserOutlined />, label: 'Users' },
  { key: '2', icon: <VideoCameraOutlined />, label: 'Videos' },
  { key: '3', icon: <UploadOutlined />, label: 'Upload' },
  { key: '4', icon: <BarChartOutlined />, label: 'Analytics' },
  { key: '5', icon: <CloudOutlined />, label: 'Cloud' },
  { key: '6', icon: <AppstoreOutlined />, label: 'Apps' },
  { key: '7', icon: <TeamOutlined />, label: 'Team' },
  { key: '8', icon: <ShopOutlined />, label: 'Shop' },
];

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ username: '', email: '', role: 'user', banned: 'false' });
  const [sort, setSort] = useState({ field: 'created_at', direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    fetchUsers();
  }, [filters, sort]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const adjustedFilters = {
        ...filters,
        banned: filters.banned === 'true' ? true : filters.banned === 'false' ? false : undefined,
      };
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...adjustedFilters,
          sortBy: sort.field,
          sortDir: sort.direction,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        params: error.config?.params,
        fullError: error.response?.data,
      });
      const errorMsg = error.response?.status === 401
        ? 'Unauthorized: Please log in again'
        : error.response?.data?.message || 'Failed to fetch users due to a server error';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8080/api/users/${id}/ban`,
        { ban: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`User ${currentStatus ? 'unbanned' : 'banned'} successfully`);
      fetchUsers();
    } catch (error) {
      message.error('Failed to update ban status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const showModal = (user = null) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const form = document.querySelector('.ant-modal .ant-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditUser(null);
  };

  const handleUserSaved = () => {
    setIsModalOpen(false);
    setEditUser(null);
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    message.success('Logged out successfully');
    navigate('/login'); // Redirect to login page
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => setSort({ field: 'username', direction: sort.direction === 'asc' ? 'desc' : 'asc' }),
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => setSort({ field: 'email', direction: sort.direction === 'asc' ? 'desc' : 'asc' }),
      }),
    },
    { title: 'Role', dataIndex: 'role' },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      sorter: true,
      render: (text) => new Date(text).toLocaleString(),
      onHeaderCell: () => ({
        onClick: () => setSort({ field: 'created_at', direction: sort.direction === 'asc' ? 'desc' : 'asc' }),
      }),
    },
    {
      title: 'Banned',
      dataIndex: 'banned',
      render: (banned) => (banned ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            type="link"
            onClick={() => handleBanToggle(record.id, record.banned)}
          >
            {record.banned ? 'Unban' : 'Ban'}
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const { Option } = Select;

  // Consistent height and styling for all filter elements
  const inputStyle = 'flex-1 min-w-[200px] max-w-[300px] h-10 rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors';
  const selectStyle = 'flex-1 min-w-[120px] max-w-[150px] h-10';

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="h-14 m-1 bg-white-200 flex items-center justify-center rounded">
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          alt="Ant Design Logo"
          className="h-9 mr-2" // Adjust height and add margin
        />
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent">
            AdminPanel
          </span>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
      </Sider>
      <Layout>
      <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="text-xl font-semibold p-4">Admin Dashboard</div>
          <Tooltip title="Log out">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="mr-4 text-gray-600 hover:text-red-500 hover:bg-gray-100 transition-colors"
            >
              Logout
            </Button>
          </Tooltip>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Add User Button */}
            <Button type="primary" onClick={() => showModal()} className="mb-6">
              Add User
            </Button>

            {/* Modal for Add/Edit User */}
            <Modal
              title={editUser ? 'Edit User' : 'Add User'}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Save"
              cancelText="Cancel"
            >
              <UserForm
                onUserSaved={handleUserSaved}
                initialValues={editUser}
                isEditMode={!!editUser}
              />
            </Modal>

            {/* Filters - Single Row */}
            <div className="flex items-center gap-4 mb-6 flex-wrap sm:flex-nowrap bg-gray-50 p-4 rounded-lg shadow-sm">
            <Tooltip title="Search by username">
              <Input
                placeholder="Username"
                value={filters.username}
                onChange={(e) => handleFilterChange('username', e.target.value)}  // Changed to handleFilterChange
                className={inputStyle}
                allowClear
              />
            </Tooltip>
            <Tooltip title="Search by email">
              <Input
                placeholder="Email"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}  // Changed to handleFilterChange
                className={inputStyle}
                allowClear
              />
            </Tooltip>
            <Tooltip title="Filter by role">
              <Select
                value={filters.role}
                onChange={(value) => handleFilterChange('role', value)}  // Changed to handleFilterChange
                className={selectStyle}
                placeholder="Role"
                allowClear
                dropdownStyle={{ minWidth: 120 }}
                style={{ height: '40px' }}
              >
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
              </Select>
            </Tooltip>
            <Tooltip title="Filter by ban status">
              <Select
                value={filters.banned}
                onChange={(value) => handleFilterChange('banned', value)}  // Changed to handleFilterChange
                className={selectStyle}
                placeholder="Status"
                allowClear
                dropdownStyle={{ minWidth: 120 }}
                style={{ height: '40px' }}
              >
                <Option value="true">Banned</Option>
                <Option value="false">Not Banned</Option>
              </Select>
            </Tooltip>
          </div>

            {/* User Table */}
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              bordered
            />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;