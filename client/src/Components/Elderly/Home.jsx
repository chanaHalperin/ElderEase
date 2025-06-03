import { lazy, useEffect, useState } from "react";
import '../../styles/Elderly/ElderlyHome.css';
import { Card, Row, Col, Typography, Button, Divider, Spin } from "antd";
import { HomeOutlined, CalendarOutlined, HeartOutlined, InfoCircleOutlined, AppstoreOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ActivityCard from "../Activity/ActivityCard";
import { useSelector } from "react-redux";
const ElderlyCalender = lazy(() => import('./ElderlyCalender'));
const { Title, Paragraph } = Typography;
const doctorInfo = {
  name: "ד\"ר יוסי לוי",
  phone: "052-1234567",
  specialty: "רפואת משפחה",
  img: "https://randomuser.me/api/portraits/men/32.jpg"
};
const Home = () => {
  const [elderly, setElderly] = useState(null);
  const [apartmentInfo, setApartmentInfo] = useState([])
  const [apartmentCleanInfo, setApartmentCleanInfo] = useState([]);
  const user = useSelector((state) => state.user);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchElderly = async () => {
      try {
        const elderlyRes = await axios.get(`http://localhost:8080/Elderly/${user._id}/getElderlyByUserId`, {
          withCredentials: true,
        });
        setElderly(elderlyRes.data);
      } catch (error) {
        message.error("אירעה שגיאה בעת טעינת הנתונים.");
      }
    };
    fetchElderly();
  }, [user]);

  useEffect(() => {
    if (!elderly) return;
    axios.get(`http://localhost:8080/Apartment/getById/${elderly.ApartmentId}`).then(
      response => {
        setApartmentInfo(response.data)
      }
    ).catch(error => {
      message.error("אירעה שגיאה בעת טעינת הנתונים.");
    }
    )
    axios.get(`http://localhost:8080/ApartmentClean/getByAppartmentId/${elderly.ApartmentId}`).then(response => {
      setApartmentCleanInfo(response.data[0])
    }).catch(error => {
      message.error("אירעה שגיאה בעת טעינת הנתונים .דירה לנקיון");
    })
  }, [elderly])
  useEffect(() => {
    axios.get('http://localhost:8080/Activity/getAll')
      .then(response => {
        const allActivities = response.data;
        const today = new Date();
        const sorted = [...allActivities].sort((a, b) => new Date(a.Date) - new Date(b.Date));
        const futureActivities = sorted.filter(activity => new Date(activity.Date) >= today);
        let top3 = futureActivities.slice(0, 3);
        if (top3.length < 3) {
          const remaining = sorted.filter(act => !top3.includes(act)).slice(0, 3 - top3.length);
          top3 = top3.concat(remaining);
        }
        setActivities(top3);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [elderly]);

  return (
    <div className="elderly-home-bg">
      <div className="elderly-home-header">
        <div className="elderly-home-title">ברוך הבא לאזור הדייר</div>
        <div className="elderly-home-desc">
          כאן תוכל לצפות בלוח הפעילויות שלך, בפרטי הדירה, ובאירועים חשובים.
        </div>
      </div>

      <div className="elderly-main-content">
        {/* עמודת מידע צדדית */}
        <div className="elderly-side-info">
          <Card className="elderly-apartment-card" title={<><HomeOutlined /> פרטי הדירה שלך</>}>
            <div><b>מספר דירה:</b> {apartmentInfo.Id}</div>
            <div><b>קומה:</b> {apartmentInfo.Floor}</div>
            <div><b>גודל:</b> {apartmentInfo.SizeInSquareMeters} מ"ר</div>
            <div><b>סטטוס:</b> {apartmentInfo.Status}</div>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ color: "#1890ff" }}>
              <CalendarOutlined /> <b>ניקיון הבא:</b>{" "}
              {apartmentCleanInfo && apartmentCleanInfo.Day
                ? (
                  <>
                    {apartmentCleanInfo.Day}
                    <br />
                    {apartmentCleanInfo.StartTime} - {apartmentCleanInfo.EndTime}
                    {apartmentCleanInfo.Comments && ` (${apartmentCleanInfo.Comments})`}
                  </>
                )
                : <span style={{ color: "#aaa" }}>אין נתוני ניקיון זמינים</span>
              }
            </div>
            <div><b>מנקה:</b> {apartmentCleanInfo && apartmentCleanInfo.cleanerId ? apartmentCleanInfo.cleanerId : <span style={{ color: "#aaa" }}>לא ידוע</span>}</div>
          </Card>
          <Card className="elderly-info-card" title={<><InfoCircleOutlined /> מידע נוסף</>}>
            <div>לכל שאלה ניתן לפנות למזכירות: <b>03-1234567</b></div>
            <div>שעות פעילות: 08:00-16:00</div>
            <div>כתובת: רח' הדוגמה 5, עיר הדוגמה</div>
          </Card>
          <Card className="elderly-info-card" title={<><HeartOutlined /> הרופא האישי שלך</>}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={doctorInfo.img}
                alt="הרופא האישי"
                style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", border: "2px solid #1890ff" }}
              />
              <div>
                <div><b>{doctorInfo.name}</b></div>
                <div style={{ fontSize: "0.95em", color: "#4b587c" }}>{doctorInfo.specialty}</div>
                <div style={{ fontSize: "0.95em" }}>טלפון: <a href={`tel:${doctorInfo.phone}`}>{doctorInfo.phone}</a></div>
              </div>
            </div>
            <Button type="primary" size="small" style={{ marginTop: 14, borderRadius: 18, width: "100%" }}
              onClick={() => window.open("https://www.maccabi4u.co.il/", "_blank")}
            >
              קבע תור
            </Button>
          </Card>
        </div>

        {/* עמודת לוח שנה רחבה */}
        <div className="elderly-calendar-wide">
          <Card className="elderly-calendar-card" bodyStyle={{ padding: 0 }}>
            <ElderlyCalender />
          </Card>
        </div>
      </div>

      {/* אזור הצעות לפעילויות */}
      <div className="elderly-suggested-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Title level={4} className="elderly-suggested-title" style={{ marginBottom: 0 }}>
            <HeartOutlined style={{ color: "#faad14", marginLeft: 8 }} />
            הצעות לפעילויות שיכולות לעניין אותך
          </Title>
          <Button
            type="link"
            icon={<AppstoreOutlined />}
            style={{ fontWeight: 600, fontSize: "1.1em" }}
            onClick={() => navigate("/ActivitiesList")}
          >
            לכל הפעילויות
          </Button>
        </div>
        {loading ? (
          <Spin />
        ) : (
          <Row gutter={[24, 24]} className="activities-list-row" justify="center">
            {activities.map((activity) => (
              <Col xs={24} sm={12} md={8} key={activity._id}>
                <ActivityCard activity={activity} elderlyId={elderly?._id} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* הודעות מהמערכת */}
      <div style={{ maxWidth: 900, margin: "32px auto 0" }}>
        <Card
          title={<><InfoCircleOutlined style={{ color: "#1890ff" }} /> הודעות מהמערכת</>}
          style={{ borderRadius: 18, marginBottom: 24, background: "#f9fbfd" }}
        >
          <ul style={{ fontSize: 16, color: "#4b587c", marginRight: 24 }}>
            <li>ברוך הבא! אנו מאחלים לך בריאות ופעילות מהנה.</li>
            <li>זכור לבדוק את לוח הפעילויות – יש חוגים חדשים!</li>
            <li>במקרה חירום, חייג <b>101</b> או פנה למוקד דרך הכפתור למטה.</li>
          </ul>
        </Card>
      </div>

      {/* קישורים שימושיים */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Card
          title={<><HomeOutlined style={{ color: "#52c41a" }} /> קישורים שימושיים</>}
          style={{ borderRadius: 18, marginBottom: 24, background: "#fff" }}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                block
                icon={<PhoneOutlined />}
                size="large"
                style={{ marginBottom: 12, borderRadius: 12 }}
                onClick={() => window.open("tel:101")}
              >
                מוקד חירום 101
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="default"
                block
                icon={<CalendarOutlined />}
                size="large"
                style={{ marginBottom: 12, borderRadius: 12 }}
                onClick={() => window.open("https://www.maccabi4u.co.il/", "_blank")}
              >
                קביעת תור לרופא
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="dashed"
                block
                icon={<InfoCircleOutlined />}
                size="large"
                style={{ marginBottom: 12, borderRadius: 12 }}
                onClick={() => window.open("https://www.btl.gov.il/Pages/default.aspx", "_blank")}
              >
                ביטוח לאומי
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* שאלות ותשובות נפוצות */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Card
          title={<><InfoCircleOutlined style={{ color: "#1890ff" }} /> שאלות ותשובות נפוצות</>}
          style={{ borderRadius: 18, marginBottom: 24, background: "#f9fbfd" }}
        >
          <ul style={{ fontSize: 16, color: "#4b587c", marginRight: 24 }}>
            <li>
              <b>איך נרשמים לפעילות?</b><br />
              ניתן להירשם דרך לוח הפעילויות או לפנות למזכירות.
            </li>
            <li>
              <b>מה עושים במקרה חירום?</b><br />
              יש להתקשר למוקד 101 או ללחוץ על כפתור החירום בדף זה.
            </li>
            <li>
              <b>איך יוצרים קשר עם צוות המקום?</b><br />
              כל הפרטים מופיעים באזור המידע או בלחיצה על "קישורים שימושיים".
            </li>
          </ul>
        </Card>
      </div>

      {/* תחתית הדף */}
      <div style={{ textAlign: "center", color: "#888", marginTop: 40, marginBottom: 10 }}>
        <Divider />
        <Paragraph>
          מערכת דיור מוגן &copy; {new Date().getFullYear()} | כל הזכויות שמורות
        </Paragraph>
      </div>
    </div>
  );
};

export default Home;
