import { useState, useEffect } from 'react';
import { Table, Dropdown, Menu, Button, Descriptions } from 'antd';
import { CheckOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEnum } from "../../Enums/useEnum"; // עדכון ה-import לנתיב הנכון
import { sendEmail } from '../../SendEmail';

const QueueTable = ({ openNotification, currentRole, scrollToTop }) => {

  const [data, setData] = useState([]);
  const [managerId, setManagerId] = useState(null);
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : useSelector((state) => state.user);
  const { data: UserStatus, loading, error } = useEnum("getUserStatus");

  useEffect(() => {
    if (user && user._id) { 
      axios.get(`http://localhost:8080/Manager/getManegerByUserId/${user._id}`, { withCredentials: true })
        .then((res) => {
          setManagerId(res.data._id);
        })
        .catch((err) => {
          message.error('Error fetching manager ID:', err);
        });
    } else {
      message.log("User data not yet available, skipping manager ID fetch.");
    }
  }, [user]); // מאזין לשינויים ב-user

  useEffect(() => {
    if (managerId) {
      axios.post(
        `http://localhost:8080/Manager/${managerId}/getQueueByRole`,
        { role: currentRole }, // זה הנתונים שנשלחים
        { withCredentials: true } // זה הקונפיגורציה של הבקשה
      )
        .then((response) => {
          if (response.status === 200) {
            const processedData = response.data.map((item) => ({
              ...item,
              key: item._id, // מיפוי _id ל-key
            }));
            setData(processedData);
          } else {
            message.error("Unexpected response");
          }
        })
        .catch((error) => {
          message.error('Error fetching queue data');
        });
    }
  }, [managerId, currentRole]); // מאזין לשינויים ב-managerId וב-curentRole

  const handleAccept = async (_id) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך לאשר משתמש זה??");
    if (!confirmed) {
      return; // המשתמש לחץ על ביטול – עצור את הפונקציה כאן
    }
    const userAccepted = await axios.get(`http://localhost:8080/User/getById/${_id}`)
    try {
      axios.post(`http://localhost:8080/Manager/${managerId}/deleteUserFromQueueByIdRole`,
        {
          userId: _id,
          newStatus: UserStatus.CONFIRMED
        },// עדכון הסטטוס ל-CONFIRMED       
        {
          headers: { 'Content-Type': 'application/json' }
        }, { withCredentials: true }
      )
      setData((prevData) => prevData.filter((item) => item._id !== _id));
      openNotification("success", "המשתמש נוסף!", "המשתמש נוסף בהצלחה למערכת.");
      sendEmail({
        to: userAccepted.data.Email,
        subject: `wow ${userAccepted.data.FirstName} ${userAccepted.data.LastName}`,
        text: "the manager accepted you to the community, come and finish your signUp http://localhost:5173",
      })
    }
    catch (err) {
      openNotification("error", "שגיאה בהוספת משתמש", "נסה שוב או פנה לתמיכה.");
    };
  };

  const handleDelete = async (_id) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך לדחות משתמש זה??");
    if (!confirmed) {
      return; // המשתמש לחץ על ביטול – עצור את הפונקציה כאן
    }
    const userADeleted = await axios.get(`http://localhost:8080/User/getById/${_id}`)
    axios.post(`http://localhost:8080/Manager/${managerId}/deleteUserFromQueueByIdRole`, { withCredentials: true },
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
        openNotification("success", "המשתמש נמחק!", "המשתמש הוסר בהצלחה מהמערכת.");
      })
      .catch((err) => {
        openNotification("error", "שגיאה במחיקת משתמש", "נסה שוב או פנה לתמיכה.");
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
      title: 'Last Name',
      dataIndex: 'LastName',
      key: 'LastName',
    },
    {
      title: 'First Name',
      dataIndex: 'FirstName',
      key: 'FirstName',
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
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  style={{ background: "#fff", borderRadius: 12, margin: 0, direction: "rtl" }}
                >
                  <Descriptions.Item label="טלפון">{record.Phone || "-"}</Descriptions.Item>
                  <Descriptions.Item label="תאריך יצירה">{record.CreatedAt || "-"}</Descriptions.Item>
                  <Descriptions.Item label="סטטוס">{record.Status || "-"}</Descriptions.Item>
                </Descriptions>
              ),
              rowExpandable: (record) => true,
            }}
          />
        </div>
      )}
    </>
  );

};

export default QueueTable;