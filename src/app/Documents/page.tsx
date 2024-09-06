'use client';

import React, { useState } from 'react';
import { Table, Input, Button, Space, Pagination, Upload, message } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const DocumentsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Example document data (you can replace this with actual data)
  const dataSource = [
    { key: '1', title: 'Document 1', size: '2MB', type: 'PDF' },
    { key: '2', title: 'Document 2', size: '5MB', type: 'Word' },
    // Add more documents...
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const uploadProps = {
    name: 'file',
    action: '/upload',
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
            placeholder="Search documents"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Document</Button>
          </Upload>
        </div>

        <Table
          dataSource={dataSource.filter((item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
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

export default DocumentsPage;
