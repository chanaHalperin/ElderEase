import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Button, Typography, message,Checkbox, Input, Space,notification } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined  } from '@ant-design/icons';
import { useEnum } from "../Enums/useEnum";
const { Title } = Typography;

const hiddenFields = [
  "Password", "__v", "_id", "RefId", "Id", "someOtherField",
  "QueueElderlyToSignIn", "CreatedAt", "ApartmentId",
  "ActivitiesList", "Status", "Role"
];

// שדות שצריכים להיות תמיד מערכים
const arrayFields = ["dayInWork","PreferredCleaningDays"];

const Profile = () => {
  const { data: DayInWeek, loadingDayInWeek, errorDayInWeek } = useEnum("getDayInWeek");
  //הערך שחוזר מקריאה זו הוא
  //DayInWeek enum 
//{SUNDAY: 'sunday', MONDAY: 'monday', TUESDAY: 'tuesday', WEDNESDAY: 'wednesday', THURSDAY: 'thursday', …}
//ואיתן צריך לעבוד


  const { _id } = useParams();
 const [api, contextHolder] = notification.useNotification();
  const [FUlluser, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/User/getByIdWithPopulate/${_id}`);
      setUser(res.data);
      setEditedUser(res.data);
    } catch (err) {
      console.error("שגיאה בשליפת המשתמש:", err);
      message.error("נכשלה טעינת הפרופיל");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (key, value, parent = null) => {
  const parsedValue = arrayFields.includes(key) && !Array.isArray(value)
    ? value.split(",").map((item) => item.trim())
    : value;

  if (parent === "RefId") {
    setEditedUser((prev) => ({
      ...prev,
      RefId: {
        ...prev.RefId,
        [key]: parsedValue,
      },
    }));
  } else {
    setEditedUser((prev) => ({
      ...prev,
      [key]: parsedValue,
    }));
  }
};

  
function openNotification(type, messageText, descriptionText) {
  const icon = type === "success" 
    ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
    : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;

  api.open({
    message: messageText,
    description: descriptionText,
    icon,
    placement: "bottomLeft",
    duration: 4,
  });
}

  const saveChanges = async () => {
    const role = editedUser.Role;
    const moduleName = role === "elderly" ? "Elderly" :
      role === "cleaner" ? "Cleaner" :
        role === "manager" ? "Manager" : "Relative";

    try {
      const { RefId, ...mainUserData } = editedUser;

      await axios.put(`http://localhost:8080/User/update/${_id}`, mainUserData);

      if (RefId && RefId._id) {
        await axios.put(`http://localhost:8080/${moduleName}/update/${RefId._id}`, RefId);
      }
      openNotification("success", "הצלחה", "הנתונים נשמרו בהצלחה"); 
      setUser(editedUser);
      setIsEditing(false);
    } catch (err) {
      openNotification("error", "שגיאה בשמירה", "התרחשה תקלה בעת שמירת השינויים. נסה שוב מאוחר יותר.");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditedUser(FUlluser);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderField = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    } else if (typeof value === "object" && value !== null) {
      return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(" | ");
    }
    return value?.toString();
  };

 const renderFields = (userData) => {
  const items = [];

  for (const [key, value] of Object.entries(userData)) {
    if (hiddenFields.includes(key)) continue;

    // ✅ טיפול מיוחד לשדה HasPhilipin (בשם נכון אולי HasPhilippineCaregiver?)
    if (key === "HasPhilipin") {
      items.push(
        <Descriptions.Item key={key} label="מטפל פיליפיני">
          {isEditing ? (
            <Checkbox
              checked={!!editedUser[key]}
              onChange={(e) => handleChange(key, e.target.checked)}
            >
              יש מטפל
            </Checkbox>
          ) : (
            value ? "כן" : "לא"
          )}
        </Descriptions.Item>
      );
      continue;
    }

    // ✅ טיפול מיוחד לשדה PreferredCleaningDays
    if (key === "PreferredCleaningDays"||key === "DayInWork") {
     items.push(
  <Descriptions.Item key={key} label="ימי ניקיון מועדפים">
    {isEditing ? (
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="בחר ימים מועדפים"
        value={editedUser[key]}
        onChange={(val) => handleChange(key, val)}
        options={dayInWeekOptions}
      />
    ) : (
      (value || []).join(", ")
    )}
  </Descriptions.Item>
);
      continue;
    }

    // ✅ ברירת מחדל לשאר השדות
    items.push(
      <Descriptions.Item key={key} label={key}>
        {isEditing ? (
          <Input
            value={Array.isArray(editedUser[key]) ? editedUser[key].join(", ") : editedUser[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ) : (
          renderField(key, value)
        )}
      </Descriptions.Item>
    );
  }

  // 🟨 תתי שדות של RefId
  if (userData.RefId && typeof userData.RefId === "object") {
    for (const [key, value] of Object.entries(userData.RefId)) {
      if (hiddenFields.includes(key)) continue;

      items.push(
        <Descriptions.Item key={`RefId-${key}`} label={`${key}`}>
          {isEditing ? (
            <Input
              value={
                Array.isArray(editedUser.RefId?.[key])
                  ? editedUser.RefId[key].join(", ")
                  : editedUser.RefId?.[key]
              }
              onChange={(e) => handleChange(key, e.target.value, "RefId")}
            />
          ) : (
            renderField(key, value)
          )}
        </Descriptions.Item>
      );
    }
  }

  return items;
};
useEffect(() => {
  console.log("DayInWeek enum", DayInWeek);
}, [DayInWeek]);




  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "5rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!FUlluser) return <div>לא נמצאו נתונים</div>;

  return (
    <div style={{ padding: "2rem", color: "#000", backgroundColor: "#fff", fontSynthesis: "none" }}>
      <Title level={2}>פרופיל אישי</Title>
        {contextHolder} 
      <Descriptions bordered column={1}>
        {renderFields(FUlluser)}
      </Descriptions>

      <Space style={{ marginTop: "1rem" }}>
        {isEditing ? (
          <>
            <Button type="primary" onClick={saveChanges}>שמור</Button>
            <Button onClick={cancelEdit}>ביטול</Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setIsEditing(true)}>עריכת פרטים</Button>
        )}
      </Space>
    </div>
  );
};

export default Profile;
