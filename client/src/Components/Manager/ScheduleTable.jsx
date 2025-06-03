// import React, { useState, useEffect } from 'react';
// import { Table, Spin, Alert } from 'antd';
// import axios from 'axios';

// const ScheduleTable = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {

//     setLoading(true);
//     fetch('http://localhost:8080/api/schedule')
//       .then(res => {
//         // if (!res.ok) {console.log(`HTTP ${res.data}`) ;return};

//         return res.json();
//       })
//       .then(json => {
//         // מוסיפים key ייחודי לכל שורה
//         const withKeys = json.map((item, idx) => ({ key: idx, ...item }));
//         setData(withKeys);
//       })
//       .catch(err => console.log(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   const columns = [
//     { title: 'קוד זקן',     dataIndex: 'elderlyId',  key: 'elderlyId' },
//     { title: 'קוד מנקה',     dataIndex: 'cleanerId',  key: 'cleanerId' },
//     { title: 'יום',          dataIndex: 'day',        key: 'day' },
//     { title: 'שעת התחלה',    dataIndex: 'startTime',  key: 'startTime' },
//     { title: 'שעת סיום',     dataIndex: 'endTime',    key: 'endTime' },
//     { title: 'הערה',         dataIndex: 'note',       key: 'note' },
//   ];

//   if (loading) return <Spin tip="טוען..." style={{ margin: 20 }} />;
//   if (error)   return <Alert type="error" message="שגיאה בטעינת נתונים" description={error} />;

//   return <Table columns={columns} dataSource={data} pagination={false} />;
// };

// export default ScheduleTable;
// File: ScheduleTable.jsx
import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Tag, Statistic, Row, Col } from 'antd';
import axios from 'axios';

const ScheduleTable = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ unchanged: 0, new: 0, unassigned: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/schedule')
      .then(res => res.json())
      .then(json => {
        
        const withKeys = json.map((item, idx) => ({ key: idx, ...item }));
        setData(withKeys);
        console.log(withKeys)
        // סטטיסטיקות
        const stat = { unchanged: 0, new: 0, unassigned: 0 };
        withKeys.forEach(item => {
          if (item.status === 'unchanged') stat.unchanged++;
          else if (item.status === 'new') stat.new++;
          else if (item.status === 'unassigned') stat.unassigned++;
        });
        setStats(stat);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statusTag = status => {
    switch (status) {
      case 'unchanged': return <Tag color="green">שיבוץ קיים</Tag>;
      case 'new': return <Tag color="blue">חדש</Tag>;
      case 'unassigned': return <Tag color="red">לא שובץ</Tag>;
      default: return null;
    }
  };

  const columns = [
    { title: 'קוד דירה',     dataIndex: 'apartmentId',  key: 'apartmentId' },
    { title: 'קוד מנקה',     dataIndex: 'cleanerId',    key: 'cleanerId' },
    { title: 'יום',          dataIndex: 'day',          key: 'day' },
    { title: 'שעת התחלה',    dataIndex: 'startTime',    key: 'startTime' },
    { title: 'שעת סיום',     dataIndex: 'endTime',      key: 'endTime' },
    { title: 'הערה',         dataIndex: 'note',         key: 'note' },
    {
      title: 'סטטוס',
      dataIndex: 'status',
      key: 'status',
      render: status => statusTag(status)
    }
  ];

  if (loading) return <Spin tip="טוען..." style={{ margin: 20 }} />;
  if (error) return <Alert type="error" message="שגיאה בטעינת נתונים" description={error} />;
console.log("error" + error)
  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col><Statistic title="שיבוצים קיימים" value={stats.unchanged} valueStyle={{ color: 'green' }} /></Col>
        <Col><Statistic title="שיבוצים חדשים" value={stats.new} valueStyle={{ color: 'blue' }} /></Col>
        <Col><Statistic title="לא שובצו" value={stats.unassigned} valueStyle={{ color: 'red' }} /></Col>
      </Row>
      <Table columns={columns} dataSource={data} pagination={false} />
    </>
  );
};

export default ScheduleTable;
