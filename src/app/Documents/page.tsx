"use client";
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Pagination, Upload, message, Modal, Form, Select } from 'antd';
import { UploadOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAllDocuments, addDocument, getAllThemes, getTheme, deleteDocument, updateDocument } from '@/services/documentService';
import { User } from '@/services/utilisateurService'; // Assuming this is the correct path for the interface

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null); // For tracking if a document is being edited
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(''); // Add state for file name
  const [themes, setThemes] = useState<{ id: number; titre: string }[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchDocuments();
    fetchThemes();

    // Retrieve user from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await getAllDocuments();
      const docsWithThemes = await Promise.all(
        docs.map(async (doc) => {
          if (doc.idTheme) {
            const theme = await getTheme(doc.idTheme.id);
            return { ...doc, theme };
          }
          return doc;
        })
      );
      setDocuments(docsWithThemes);
    } catch (error) {
      message.error('Failed to fetch documents');
    }
  };

  const fetchThemes = async () => {
    try {
      const fetchedThemes = await getAllThemes();
      setThemes(fetchedThemes);
    } catch (error) {
      message.error('Failed to fetch themes');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingDocument) {
        // Update document
        await updateDocument(editingDocument.id, {
          ...values,
          auteur: user?.nom,
          file: file ? file : editingDocument.filePath // Use the existing file if no new file is uploaded
        });
        message.success('Document updated successfully');
      } else {
        // Add document
        if (!file) {
          message.error('Please upload a file before submitting');
          return;
        }
        await addDocument({ ...values, auteur: user?.nom }, file, values.idTheme); // Add user name and file to the document
        message.success('Document added successfully');
      }

      fetchDocuments();
      form.resetFields();
      setFile(null);
      setFileName(''); // Reset the file name
      setIsModalVisible(false);
      setEditingDocument(null);
    } catch (error) {
      message.error('Failed to save document');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDocument(null);
    form.resetFields(); // Reset form fields
    setFile(null); // Clear file state
    setFileName(''); // Clear file name
  };

  const handleFileChange = (info: any) => {
    if (info.fileList.length > 0) {
      const selectedFile = info.fileList[0].originFileObj;
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set the file name
    } else {
      setFile(null);
      setFileName(''); // Clear the file name
    }
  };

  const { confirm } = Modal;

  const handleDelete = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this document?',
      icon: <ExclamationCircleOutlined />,
      content: 'Once deleted, the document cannot be recovered.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await deleteDocument(id);
          message.success('Document deleted successfully');
          fetchDocuments();
        } catch (error) {
          message.error('Failed to delete document');
        }
      },
      onCancel() {
        console.log('Cancel deletion');
      },
    });
  };

  const handleEdit = (record: any) => {
    setEditingDocument(record);
    form.setFieldsValue({
      titre: record.titre,
      description: record.description,
      idTheme: record.idTheme?.id,
    });
    setFileName(record.file || ''); // Set the file name if available
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'titre',
      key: 'titre',
    },
    {
      title: 'Theme',
      dataIndex: 'theme',
      key: 'theme',
      render: (text: any, record: any) => record.theme?.titre || 'No theme',
    },
    {
      title: 'Date de dépôt',
      dataIndex: 'dateDepot',
      key: 'dateDepot',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    customRequest: ({ file, onSuccess }: any) => {
      setFile(file);
      setFileName(file.name); // Set the file name
      onSuccess(null, file);
    },
    showUploadList: false,
  };

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
          <Button icon={<UploadOutlined />} onClick={() => setIsModalVisible(true)}>
            Upload Document
          </Button>
        </div>

        <Table
          dataSource={documents.filter((item) =>
            item.titre.toLowerCase().includes(searchText.toLowerCase())
          )}
          columns={columns}
          pagination={false}
          rowKey="id"
          style={{ marginBottom: '20px' }}
        />

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={documents.length}
          onChange={handlePageChange}
          style={{ textAlign: 'center' }}
        />

        <Modal
          title={editingDocument ? 'Edit Document' : 'Add Document'}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="titre"
              label="Document Title"
              rules={[{ required: true, message: 'Please input the document title!' }]}
            >
              <Input placeholder="Enter document title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input the document description!' }]}
            >
              <Input.TextArea placeholder="Enter document description" />
            </Form.Item>

            <Form.Item
              label="User"
            >
              <Input value={user?.nom} disabled />
            </Form.Item>

            <Form.Item
              name="idTheme"
              label="Theme"
              rules={[{ required: true, message: 'Please select a theme!' }]}
            >
              <Select placeholder="Select a theme">
                {themes.map((theme) => (
                  <Select.Option key={theme.id} value={theme.id}>
                    {theme.titre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Upload File"
            >
              {editingDocument ? (
                // Only display the file name when editing a document
                <div style={{ marginTop: '10px' }}>
                  Document: {fileName || 'No file selected'}
                </div>
              ) : (
                <Upload {...uploadProps} onChange={handleFileChange}>
                  <Button icon={<UploadOutlined />}>Upload</Button> &nbsp;
                  { fileName || 'No file selected'}
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default DocumentsPage;
