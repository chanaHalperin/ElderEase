import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Menu, Button } from 'antd';
import { CheckOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEnum } from "../../Enums/useEnum"; // עדכון ה-import לנתיב הנכון
import { sendEmail } from '../../SendEmail';
const QueueTable = ({ currentRole }) => {
  const [data, setData] = useState([]);
  const [managerId, setManagerId] = useState(null);
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : useSelector((state) => state.user);
  console.log("user in QueueTable", user);
  const { data: UserStatus, loading, error } = useEnum("getUserStatus");


  useEffect(() => {
    if (user && user._id) { // בדוק אם user קיים ויש לו _id
      // קריאה לשרת לקבלת ה-managerId
      axios.get(`http://localhost:8080/Manager/getManegerByUserId/${user._id}`)
        .then((res) => {
          console.log("Manager ID fetched: ", res.data._id);
          setManagerId(res.data._id);
        })
        .catch((err) => {
          console.error('Error fetching manager ID:', err);
        });
    } else {
      console.log("User data not yet available, skipping manager ID fetch.");
    }
  }, [user]); // מאזין לשינויים ב-user

  useEffect(() => {
    if (managerId) {
      // קריאה לשרת לקבלת התור לפי Role
      axios.post(`http://localhost:8080/Manager/${managerId}/getQueueByRole`,
        { role: currentRole },
        { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.status === 200) {
            const processedData = response.data.map((item) => ({
              ...item,
              key: item._id, // מיפוי _id ל-key
            }));
            setData(processedData);
          } else {
            console.error('Unexpected response:', response);
          }
        })
        .catch((error) => {
          console.error('Error fetching queue data:', error);
        });
    }
  }, [managerId, currentRole]); // מאזין לשינויים ב-managerId וב-curentRole


  const handleAccept = async (_id) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך לאשר משתמש זה??");
    if (!confirmed) {
      return; // המשתמש לחץ על ביטול – עצור את הפונקציה כאן
    }
    console.log(`Accepted item with id: ${_id}`);
    const userAccepted = await axios.get(`http://localhost:8080/User/getById/${_id}`)
    try {
      axios.post(`http://localhost:8080/Manager/${managerId}/deleteUserFromQueueByIdRole`,
        {
          userId: _id,
          newStatus: UserStatus.CONFIRMED
        },// עדכון הסטטוס ל-CONFIRMED       
        { headers: { 'Content-Type': 'application/json' } }
      )
      setData((prevData) => prevData.filter((item) => item._id !== _id));
      sendEmail({
        to: userAccepted.data.Email,
        subject: `wow ${userAccepted.data.FirstName} ${userAccepted.data.LastName}`,
        text: "the manager accepted you to the community, come and finish your signUp http://localhost:5173",
      })
    }
    catch (err) {
      console.error(err);
    };
  };

  const handleDelete = async (_id) => {
        const confirmed = window.confirm("האם אתה בטוח שברצונך לדחות משתמש זה??");
    if (!confirmed) {
      return; // המשתמש לחץ על ביטול – עצור את הפונקציה כאן
    }
    const userADeleted = await axios.get(`http://localhost:8080/User/getById/${_id}`)
    axios.post(`http://localhost:8080/Manager/${managerId}/deleteUserFromQueueByIdRole`,
      {
        userId: _id,
        newStatus: UserStatus.REJECTED
      },// עדכון הסטטוס ל-REJECTED       
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then((res) => {
        sendEmail({
          to: userADeleted.data.Email,
          subject: `hello ${userADeleted.data.FirstName} ${userADeleted.data.LastName}`,
          text: "the manager rejected you to the community, sorry..",
        })
        setData((prevData) => prevData.filter((item) => item._id !== _id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="accept" onClick={() => handleAccept(record._id)} icon={<CheckOutlined style={{ color: 'green' }} />}>
        Accept
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record._id)} icon={<DeleteOutlined style={{ color: 'red' }} />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
    },
    {
      title: 'First Name',
      dataIndex: 'FirstName',
      key: 'FirstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'LastName',
      key: 'LastName',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Dropdown overlay={menu(record)}>
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      {loading && <p>טוען סטטוסים...</p>}
      {error && <p>שגיאה בטעינת סטטוסים</p>}
      {!loading && !error && (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 5 }}
            bordered
            rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
          />
        </div>
      )}
    </>
  );

};

export default QueueTable;