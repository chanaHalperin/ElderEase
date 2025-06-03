import React from 'react';
import { Card, Button, Typography, notification } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const ActivityCard = ({ activity, elderlyId }) => {
  const user = useSelector((state) => state.user);
  const [api, contextHolder] = notification.useNotification();
  const {
    Name,
    Category,
    Location,
    MakerName,
    Price,
    MaxParticipants,
    Image
  } = activity;
  const isFull = activity.participantsList?.length >= MaxParticipants;
  const imageUrl = Image ? `http://localhost:8080/uploads/${Image}` : null;

  const openNotification = (type, messageText, descriptionText) => {
    const icon =
      type === "success"
        ? <CheckCircleOutlined style={{ color: "#52c41a" }} />
        : <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;

    api.open({
      message: messageText,
      description: descriptionText,
      icon,
      placement: "bottomLeft",
      duration: 4,
    });
  };
  const handleJoin = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/Elderly/${elderlyId}/addActivityToElderly`,
        { activityId: activity._id },
        { withCredentials: true }
      );
      openNotification("success", "הצלחה", "נרשמת בהצלחה לפעילות!");
    } catch (error) {
      console.error("Error joining activity:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Maximum number of participants reached"
      )
        openNotification("warning", "הפעילות מלאה", "לא ניתן להצטרף – כל המקומות תפוסים.");
      else {
        if (error.response &&
          error.response.data &&
          error.response.data.error === "Participant already added") {
          openNotification("success", "הצלחה", "כבר נרשמת בהצלחה לפעילות!");
        } else
          openNotification("error", "שגיאה", "אירעה שגיאה בהרשמה לפעילות. נסה שוב מאוחר יותר.");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {contextHolder}
      <Card
        className="activity-card"
        title={<Title level={4}>{Name}</Title>}
        variant="outlined"
        hoverable
        style={{ direction: 'rtl' }}
        cover={
          imageUrl && (
            <img
              src={imageUrl}
              style={{ maxHeight: 200, objectFit: 'cover' }}
            />
          )
        }
      >
        <Text><strong>קטגוריה:</strong> {Category}</Text><br />
        <Text><strong>תאריך:</strong> {new Date(activity.Date).toLocaleString('he-IL')}</Text><br />
        <Text><strong>מיקום:</strong> {Location}</Text><br />
        <Text><strong>מארגן:</strong> {MakerName}</Text><br />
        <Text><strong>מחיר:</strong> {Price} ₪</Text><br />
        <Text><strong>משתתפים מקסימליים:</strong> {MaxParticipants}</Text><br /><br />
        {user.Status === "active" && user.Role === "elderly" && (
          isFull ? (
            <Button
              type="default"
              disabled
              style={{
                backgroundColor: '#d0e7ff', // כחול בהיר מעומעם
                color: '#1a3e5f',
                borderColor: '#91caff',
                cursor: 'not-allowed'
              }}
            >
              מלא
            </Button>
          ) : (
            <Button type="primary" onClick={handleJoin}>
              הצטרף לפעילות
            </Button>
          )
        )}
      </Card>
    </>
  );
};


export default ActivityCard;
