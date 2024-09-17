'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Pagination, message, Modal } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAllUsers, deleteUser, User } from "@/services/utilisateurService"; // Import deleteUser

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        const filtered = usersData.filter(user => user.role === 'UTILISATEUR');
        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = users.filter(user => user.nom.toLowerCase().includes(value.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Handle user deletion with confirmation
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'Once deleted, this user will not be able to recover.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await deleteUser(id);
          message.success('User deleted successfully');
          // Update the user list by removing the deleted user
          const updatedUsers = users.filter(user => user.id !== id);
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="Search by name"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          dataSource={filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          columns={columns}
          pagination={false}
          rowKey="id"
          style={{ marginBottom: '20px' }}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredUsers.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center' }}
        />
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
