import { Button, Table, Modal, Input, Popconfirm, } from 'antd';
import React, { useEffect, useState } from 'react';

export const App = () => {
  const [data, setData] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addName, setAddName] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editId, setEditId] = useState(null);

  async function get() {
    try {
      const response = await fetch('http://localhost:3000/name');
      const json = await response.json();

      setData(json);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    get();
  }, []);

  async function add(params) {
    try {
      await fetch('http://localhost:3000/name', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      });
      get();
    } catch (error) {
      console.error(error);
    }
  }

  async function update(id, params) {
    try {
      await fetch(`http://localhost:3000/name/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      });
      get();
    } catch (error) {
      console.error(error);
    }
  }

  async function remove(id) {
    try {
      await fetch(`http://localhost:3000/name/${id}`, {
        method: "DELETE",
      });

      get();
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddOk = () => {
    setConfirmLoading(true);
    const obj = { name: addName, address: addAddress };
    add(obj).then(() => {
      setTimeout(() => {
        setAddModalOpen(false);
        setConfirmLoading(false);
        setAddName("");
        setAddAddress("");
      }, 1000);
    });
  };

  const handleEditOk = () => {
    setConfirmLoading(true);
    const obj = { name: editName, address: editAddress };
    update(editId, obj).then(() => {
      setTimeout(() => {
        setEditModalOpen(false);
        setConfirmLoading(false);
        setEditName("");
        setEditAddress("");
        setEditId(null);
      }, 1000);
    });
  };

  const handleEditClick = (record) => {
    setEditName(record.name);
    setEditAddress(record.address);
    setEditId(record.id || record.key);
    setEditModalOpen(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleEditClick(record)}>Edit</Button>
          <Popconfirm
            title="мехохи удалить куни?"
            onConfirm={() => remove(record.id || record.key)}
            okText="yes"
            cancelText="no"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setAddModalOpen(true)} style={{ marginBottom: 16 }}>
        addUser
      </Button>


      <Modal
        title="Add User"
        open={addModalOpen}
        onOk={handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={() => setAddModalOpen(false)}
      >
        <Input
          placeholder="Name"
          value={addName}
          onChange={e => setAddName(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Address"
          value={addAddress}
          onChange={e => setAddAddress(e.target.value)}
        />
      </Modal>

      <Modal
        title="Edit User"
        open={editModalOpen}
        onOk={handleEditOk}
        confirmLoading={confirmLoading}
        onCancel={() => setEditModalOpen(false)}
      >
        <Input
          placeholder="Name"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Address"
          value={editAddress}
          onChange={e => setEditAddress(e.target.value)}
        />
      </Modal>

      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default App;
