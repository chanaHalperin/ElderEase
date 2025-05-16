import React from 'react';
import { Card, Button, Typography, message } from 'antd';
import axios from 'axios';

const { Text, Title } = Typography;

const ActivityCard = ({ activity, elderlyId }) => {
  const {
    Name,
    Category,
    ActivityDate,
    Location,
    MakerName,
    Price,
    MaxParticipants,
    Image // ← ודא ששדה זה באמת קיים
  } = activity;

  const imageUrl = Image
    ? `http://localhost:8080/uploads/${Image}`
    : null;

  const handleJoin = async () => {
    try {
      await axios.patch(`http://localhost:8080/Elderly/${elderlyId}/addActivityToElderly`, {
        activityId: activity._id,
      });
      message.success("נרשמת בהצלחה לפעילות!");
    } catch (error) {
      console.error("שגיאה בהרשמה לפעילות:", error);
      message.error("שגיאה בהרשמה. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <Card
      title={<Title level={4}>{Name}</Title>}
      variant="outlined"
      style={{ width: 300, direction: 'rtl' }}
      hoverable
      cover={
        imageUrl && (
          <img
            alt="activity"
            src={imageUrl}
            style={{ maxHeight: 200, objectFit: 'cover' }}
          />
        )
      }
    >
      <Text><strong>קטגוריה:</strong> {Category}</Text><br />
      <Text><strong>תאריך:</strong> {new Date(ActivityDate).toLocaleString('he-IL')}</Text><br />
      <Text><strong>מיקום:</strong> {Location}</Text><br />
      <Text><strong>מארגן:</strong> {MakerName}</Text><br />
      <Text><strong>מחיר:</strong> {Price} ₪</Text><br />
      <Text><strong>משתתפים מקסימליים:</strong> {MaxParticipants}</Text><br /><br />
      <Button type="primary" onClick={handleJoin}>הצטרף לפעילות</Button>
    </Card>
  );
};


export default ActivityCard;
