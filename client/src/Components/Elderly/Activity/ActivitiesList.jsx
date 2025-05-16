import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spin, Typography } from 'antd';
import ActivityCard from './ActivityCard';

const { Title } = Typography;

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const elderlyId = "6812aa6a773c665d62a77bea"; // החלף במזהה אמיתי

  useEffect(() => {
    axios.get('http://localhost:8080/Activity/getAll')
      .then(response => {
        setActivities(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("שגיאה:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin tip="טוען..." size="large" style={{ margin: '2rem auto', display: 'block' }} />;
  }

  return (
    <>
      <Title level={2} style={{ textAlign: 'center', marginTop: 20 }}>רשימת פעילויות</Title>
      <Row gutter={[16, 16]} justify="center" style={{ padding: 20 }}>
        {activities.map(activity => (
          <Col key={activity._id}>
            <ActivityCard activity={activity} elderlyId={elderlyId} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ActivitiesList;
