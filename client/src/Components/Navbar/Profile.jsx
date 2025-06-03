import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Spin,
  Button,
  Typography,
  message,
  Checkbox,
  Input,
  Space,
  notification,
  Select,
} from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useEnum } from "../../Enums/useEnum";

const { Title } = Typography;
const hiddenFields = [
  "Password", "__v", "_id", "RefId", "Id",
  "QueueElderlyToSignIn", "CreatedAt", "ApartmentId",
  "ActivitiesList", "Status", "Role"
];

const ChooseFromList = [
  "DayInWeek", "Gender", "PersonalStatus",
  "ActivityCategory", "Roles", "UserStatus", "ApartmentStatus"
];

const arrayFields = ["DayInWork", "PreferredCleaningTime"];

const Profile = () => {
  const enums = {
    DayInWeek: useEnum("getDayInWeek"),
    Gender: useEnum("getGender"),
    PersonalStatus: useEnum("getPersonalStatus"),
    ActivityCategory: useEnum("getActivityCategory"),
    Roles: useEnum("getRoles"),
    UserStatus: useEnum("getUserStatus"),
    ApartmentStatus: useEnum("getApartmentStatus"),
  };

  const { _id } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [FUlluser, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const dayOptions = Object.keys(enums.DayInWeek?.data || {}).map((key) => ({
    label: enums.DayInWeek.data[key],
    value: key,
  }));

  const hebrewDays = enums.DayInWeek?.data || {};

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/User/getByIdWithPopulate/${_id}`, {
        withCredentials: true,
      });
      setUser(res.data);
      setEditedUser({ ...res.data, ...(res.data.RefId || {}) });
    } catch (err) {
      message.error("נכשלה טעינת הפרופיל");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (key, value) => {
    const parsedValue =
      arrayFields.includes(key) && !Array.isArray(value)
        ? value.split(",").map((item) => item.trim())
        : value;

    setEditedUser((prev) => ({
      ...prev,
      [key]: parsedValue,
    }));
  };

  const handleCleaningDayChange = (selectedDays) => {
    const updated = {};
    selectedDays.forEach((day) => {
        updated[day.toLowerCase()] = editedUser.PreferredCleaningTime?.[day] || "08:00"; // המרה לאותיות קטנות
    });
    setEditedUser((prev) => ({
        ...prev,
        PreferredCleaningTime: updated,
    }));
};

  const handleCleaningTimeChange = (day, value) => {
    setEditedUser((prev) => ({
      ...prev,
      PreferredCleaningTime: {
        ...prev.PreferredCleaningTime,
        [day]: value ? value.format("HH:mm") : null,
      },
    }));
  };

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

  const saveChanges = async () => {
    const role = editedUser.Role;
    const moduleName =
      role === "elderly" ? "Elderly" :
        role === "cleaner" ? "Cleaner" :
          role === "manager" ? "Manager" : "Relative";

    try {
      const refIdFields = {};
      const mainUserData = {};

      for (const key in editedUser) {
        if (FUlluser.RefId && key in FUlluser.RefId) {
          refIdFields[key] = editedUser[key];
        } else {
          mainUserData[key] = editedUser[key];
        }
      }

      await axios.put(`http://localhost:8080/User/update/${_id}`, mainUserData, {
        withCredentials: true,
      });

      if (FUlluser.RefId && FUlluser.RefId._id) {
        await axios.put(`http://localhost:8080/${moduleName}/update/${FUlluser.RefId._id}`, refIdFields, {
          withCredentials: true,
        });
      }

      openNotification("success", "הצלחה", "הנתונים נשמרו בהצלחה");
      setUser({ ...mainUserData, RefId: { ...refIdFields } });
      setIsEditing(false);
    } catch (err) {
      openNotification("error", "שגיאה בשמירה", "התרחשה תקלה בעת שמירת השינויים. נסה שוב מאוחר יותר.");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditedUser({ ...FUlluser, ...(FUlluser.RefId || {}) });
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderField = (key, value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object" && value !== null)
      return Object.entries(value).map(([k, v]) => `${hebrewDays[k] || k}: ${v}`).join(" | ");
    return value?.toString();
  };

  const renderFields = (userData) => {
    const items = [];
    const combinedData = { ...userData, ...(userData.RefId || {}) };

    for (const [key, value] of Object.entries(combinedData)) {
      if (hiddenFields.includes(key)) continue;

      // טיפוס חדש: PreferredCleaningTime
      // if (key === "PreferredCleaningTime") {
      //   items.push(
      //     <Descriptions.Item key={key} label="שעות ניקיון מועדפות">
      //       {isEditing ? (
      //         <div>
      //           {(editedUser.PreferredCleaningTime || []).map((item, idx) => (
      //             <Space key={idx} style={{ display: "flex", marginBottom: 8 }} align="start">
      //               <Select
      //                 placeholder="יום"
      //                 value={item.day}
      //                 onChange={(val) => {
      //                   const updated = [...editedUser.PreferredCleaningTime];
      //                   updated[idx].day = val;
      //                   handleChange("PreferredCleaningTime", updated);
      //                 }}
      //                 options={dayOptions}
      //               />
      //               <Input
      //                 placeholder="שעה (למשל: 10:00)"
      //                 value={item.time}
      //                 onChange={(e) => {
      //                   const updated = [...editedUser.PreferredCleaningTime];
      //                   updated[idx].time = e.target.value;
      //                   handleChange("PreferredCleaningTime", updated);
      //                 }}
      //               />
      //               <Button
      //                 danger
      //                 onClick={() => {
      //                   const updated = [...editedUser.PreferredCleaningTime];
      //                   updated.splice(idx, 1);
      //                   handleChange("PreferredCleaningTime", updated);
      //                 }}
      //               >
      //                 הסר
      //               </Button>
      //             </Space>
      //           ))}
      //           <Button
      //             type="dashed"
      //             onClick={() => {
      //               const updated = [...(editedUser.PreferredCleaningTime || [])];
      //               updated.push({ day: "", time: "" });
      //               handleChange("PreferredCleaningTime", updated);
      //             }}
      //             block
      //           >
      //             הוסף זמן מועדף
      //           </Button>
      //         </div>
      //       ) : (
      //         (value || []).map((item, idx) => (
      //           <div key={idx}>{item.day} בשעה {item.time}</div>
      //         ))
      //       )}
      //     </Descriptions.Item>
      //   );
      //   continue;
      // }

      if (key === "PreferredCleaningTime") {
        items.push(
            <Descriptions.Item key={key} label="שעות ניקיון מועדפות">
                {isEditing ? (
                    <div>
                        {(editedUser.PreferredCleaningTime || []).map((item, idx) => (
                            <Space key={idx} style={{ display: "flex", marginBottom: 8 }} align="start">
                                <Select
                                    placeholder="יום"
                                    value={item.day.toLowerCase()} // המרה לאותיות קטנות
                                    onChange={(val) => {
                                        const updated = [...editedUser.PreferredCleaningTime];
                                        updated[idx].day = val;
                                        handleChange("PreferredCleaningTime", updated);
                                    }}
                                    options={dayOptions}
                                />
                                <Input
                                    placeholder="שעה (למשל: 10:00)"
                                    value={item.time}
                                    onChange={(e) => {
                                        const updated = [...editedUser.PreferredCleaningTime];
                                        updated[idx].time = e.target.value;
                                        handleChange("PreferredCleaningTime", updated);
                                    }}
                                />
                                <Button
                                    danger
                                    onClick={() => {
                                        const updated = [...editedUser.PreferredCleaningTime];
                                        updated.splice(idx, 1);
                                        handleChange("PreferredCleaningTime", updated);
                                    }}
                                >
                                    הסר
                                </Button>
                            </Space>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => {
                                const updated = [...(editedUser.PreferredCleaningTime || [])];
                                updated.push({ day: "", time: "" });
                                handleChange("PreferredCleaningTime", updated);
                            }}
                            block
                        >
                            הוסף זמן מועדף
                        </Button>
                    </div>
                ) : (
                    (value || []).map((item, idx) => (
                        <div key={idx}>{item.day.toLowerCase()} בשעה {item.time}</div> // המרה לאותיות קטנות
                    ))
                )}
            </Descriptions.Item>
        );
        continue;
    }
    

      if (arrayFields.includes(key)) {
        const enumOptions = Object.entries(enums["DayInWeek"]?.data || {}).map(([label, value]) => ({
          label,
          value,
        }));
        items.push(
          <Descriptions.Item key={key} label={key}>
            {isEditing ? (
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="בחר ערכים"
                value={editedUser[key]}
                onChange={(val) => handleChange(key, val)}
                options={enumOptions}
              />
            ) : (
              Array.isArray(value) ? value.join(", ") : "אין ערכים"
            )}
          </Descriptions.Item>
        );
        continue;
      }

      if (typeof value === "boolean") {
        items.push(
          <Descriptions.Item key={key} label={key}>
            {isEditing ? (
              <Checkbox
                checked={!!editedUser[key]}
                onChange={(e) => handleChange(key, e.target.checked)}
              >
                {editedUser[key] ? "כן" : "לא"}
              </Checkbox>
            ) : (
              value ? "כן" : "לא"
            )}
          </Descriptions.Item>
        );
        continue;
      }

      if (ChooseFromList.includes(key)) {
        const enumOptions = Object.entries(enums[key]?.data || {}).map(([label, value]) => ({
          label,
          value,
        }));
        items.push(
          <Descriptions.Item key={key} label={key}>
            {isEditing ? (
              <Select
                style={{ width: "100%" }}
                value={editedUser[key]}
                onChange={(val) => handleChange(key, val)}
                options={enumOptions}
              />
            ) : (
              renderField(key, value)
            )}
          </Descriptions.Item>
        );
        continue;
      }

      items.push(
        <Descriptions.Item key={key} label={key}>
          {isEditing ? (
            <Input
              value={
                Array.isArray(editedUser[key])
                  ? editedUser[key].join(", ")
                  : editedUser[key]
              }
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ) : (
            renderField(key, value)
          )}
        </Descriptions.Item>
      );
    }
    return items;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "5rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!FUlluser) return <div>לא נמצאו נתונים</div>;

  return (
    <div style={{ padding: "2rem", color: "#000", backgroundColor: "#fff" }}>
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
