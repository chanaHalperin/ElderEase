import { Card, Row, Col, Typography, notification, Button, } from "antd";
import { UserOutlined, HomeOutlined, PlusCircleOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "../../styles/Manager/ManagerHome.css";
import { useState, useRef, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import ApartmentForm from './Apartment/ApartmentForm';
import AddActivity from './AddActivity';
import GetQueueByRole from "./GetQueueByRole";

const { Title, Paragraph } = Typography;
const ManagerPage = ({ managerName = "מנהל יקר" }) => {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddApartment, setShowAddApartment] = useState(false);
  const [showUsersTable, setShowUsersTable] = useState(false);
  const [showQueues, setShowQueues] = useState(false);
  const sectionRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const addActivityRef = useRef(null);
  const addApartmentRef = useRef(null);
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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
  if (showAddActivity && addActivityRef.current) {
    addActivityRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (showAddApartment && addApartmentRef.current) {
    addApartmentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [showAddActivity, showAddApartment]);
  const handleShow = (type) => {
    setShowAddActivity(false);
    setShowAddApartment(false);
    setShowUsersTable(false);
    setShowQueues(false);
    if (type === "activity") setShowAddActivity(true);
    if (type === "apartment") setShowAddApartment(true);
    if (type === "users") setShowUsersTable(true);
    if (type === "queues") setShowQueues(true);
  };
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAddActivity, showAddApartment, showUsersTable, showQueues]);

  const actions = [
    {
      title: "ניהול משתמשים",
      desc: "צפייה, עדכון וניהול של משתמשים במערכת.",
      icon: <TeamOutlined style={{ fontSize: "2rem", color: "#1890ff" }} />,
      onClick: () => handleShow("users")
    },
    {
      title: "הוספת דירה",
      desc: "הוסף דירה חדשה למאגר.",
      icon: <HomeOutlined style={{ fontSize: "2rem", color: "#52c41a" }} />,
      onClick: () => handleShow("apartment")
    },
    {
      title: "הוספת פעילות",
      desc: "צור פעילות חדשה לכלל הדיירים.",
      icon: <PlusCircleOutlined style={{ fontSize: "2rem", color: "#faad14" }} />,
      onClick: () => handleShow("activity")
    },
    {
      title: "ניהול תורים",
      desc: "צפייה בתורים לפי סינונים.",
      icon: <UserOutlined style={{ fontSize: "2rem", color: "#722ed1" }} />,
      onClick: () => handleShow("queues")
    }
  ];

  return (
    <div className="manager-home-bg">
      {contextHolder}
      <div className="manager-home-header">
        <Title level={2} className="manager-home-title">שלום {managerName}!</Title>
        <Paragraph className="manager-home-subtitle">
          ברוך הבא למערכת הניהול. כאן תוכל לנהל משתמשים, דירות, פעילויות ותורים בקלות וביעילות.
        </Paragraph>
      </div>
      <Row
        gutter={[32, 32]}
        justify="center"
        className="manager-home-actions"
        style={{ maxWidth: 950, margin: "0 auto", width: "100%" }}
      >
        {actions.map((action, idx) => (
          <Col xs={24} sm={12} md={8} lg={6} key={idx}>
            <div
              className="manager-home-link"
              style={{ cursor: "pointer" }}
              onClick={action.onClick}
            >
              <Card
                hoverable
                className="manager-home-card"
                cover={
                  <div className="manager-home-icon">
                    {action.icon}
                  </div>
                }
              >
                <Title level={4}>{action.title}</Title>
                <Paragraph>{action.desc}</Paragraph>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {/* הצגת הרכיב שנבחר בלבד */}
      <div ref={sectionRef} style={{ maxWidth: 950, margin: "32px auto 0 auto" }}>
        {showAddActivity && (
          <AddActivity
            openNotification={openNotification}
            scrollToTop={scrollToTop}
            setShowAddActivity={setShowAddActivity} // הוסף prop זה
          />
        )}
        {showAddActivity && (
  <div ref={addActivityRef}>
    <AddActivity
      openNotification={openNotification}
      scrollToTop={scrollToTop}
      setShowAddActivity={setShowAddActivity}
    />
  </div>
)}
{showAddApartment && (
  <div ref={addApartmentRef}>
    <ApartmentForm
      openNotification={openNotification}
      scrollToTop={scrollToTop}
      setShowAddApartment={setShowAddApartment}
    />
  </div>
)}
        {showQueues && (
          <GetQueueByRole openNotification={openNotification} />
        )}
      </div>

      {/* אזור מידע שוטף - לוח ניקיון */}
      <div className="manager-live-section">
        <Title level={3} className="manager-live-title">לוח שיבוץ משימות ניקיון</Title>
        <ScheduleTable />
      </div>
      <Button type="primary" onClick={ScheduleTable}>
        צור מערכת ניקיון חדשה
      </Button>
      {/* אזור מידע שוטף נוסף - לדוג' גרף סטטיסטיקות */}
      <div className="manager-live-section">
        <Title level={3} className="manager-live-title">סטטיסטיקות משתמשים</Title>
        {/* <UserStatsChart /> */}
      </div>
    </div>
  );
};

export default ManagerPage;