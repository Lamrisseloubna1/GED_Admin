'use client';

import React, { useState } from 'react';
import { Table, Input, Button, Space, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const UsersPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const dataSource = [
    { key: '1', name: 'John Doe', age: 32, address: 'New York' },
    { key: '2', name: 'Jane Smith', age: 28, address: 'London' },
    // Add more users here...
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button>Delete</Button>
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
          <Button type="primary">Add User</Button>
        </div>

        <Table
          dataSource={dataSource.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
          )}
          columns={columns}
          pagination={false}
          rowKey="key"
          style={{ marginBottom: '20px' }}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={dataSource.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center' }}
        />
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
