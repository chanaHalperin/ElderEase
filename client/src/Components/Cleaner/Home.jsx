import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Typography,
  Table,
  Tag,
  Spin,
  Button,
  Space,
  Tooltip,
  Statistic,
  Row,
  Col,
  Calendar,
  Timeline,
  Input,
  Divider,
  Alert,
  Avatar,
  Badge,
  Empty,
} from "antd";
import {
  HomeOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SmileOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  CheckCircleTwoTone,
  UserOutlined,
  BulbOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useEnum } from '../../Enums/useEnum'; // Assuming this is the correct path to your enumsService
const { Title, Text } = Typography;
const { Search } = Input;



const hebrewDays = {
  sunday: "ראשון",
  monday: "שני",
  tuesday: "שלישי",
  wednesday: "רביעי",
  thursday: "חמישי",
  friday: "שישי",
  shabos: "שבת",
};

const CleanerHome = () => {
  const user = useSelector((state) => state.user);

  // קבלת ה-enum של הימים מהשרת
  const {
    data: dayInWork = {},
    loading: loadingDayInWeek,
    error: errorDayInWeek,
  } = useEnum("getDayInWeek");

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cleanerData, setCleanerData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [today, setToday] = useState(dayjs());

  useEffect(() => {
    if (!user?._id) return;
    setCleanerData(null);
    setShifts([]);
    setLoading(true);
    axios.get(`http://localhost:8080/Cleaner/getCleanerByUserId/${user._id}`, {
      withCredentials: true,
    })
      .then((res) => setCleanerData(res.data))
      .catch(() => setCleanerData(null));
  }, [user?._id]);

  useEffect(() => {
    if (!cleanerData?._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:8080/ApartmentClean/getByCleanerId/${cleanerData._id}`)
      .then((res) => setShifts(res.data))
      .catch(() => setShifts([]))
      .finally(() => setLoading(false));
  }, [cleanerData?._id]);

  useEffect(() => {
    if (!search) {
      setFilteredShifts(shifts);
    } else {
      setFilteredShifts(
        shifts.filter(
          (s) =>
            (s.AppartmentId && s.AppartmentId.includes(search)) ||
            (s.Day && s.Day.includes(search)) ||
            (s.Comments && s.Comments.includes(search))
        )
      );
    }
  }, [search, shifts]);
  // אם ה-enum עדיין בטעינה - אפשר להציג spinner
  if (loadingDayInWeek || !dayInWork || Object.keys(dayInWork).length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }
  const daysArray = Object.entries(dayInWork);

  // סטטיסטיקות
  const totalShifts = shifts.length;
  const uniqueDays = [...new Set(shifts.map((s) => s.Day))].length;
  const apartments = [...new Set(shifts.map((s) => s.AppartmentId))].length;

  // מערכת שבועית - לפי ה-enum בלבד
  const weekSchedule = daysArray.map(([key, value]) => ({
    key,
    value,
    label: hebrewDays[key.toLowerCase()] || key, // הוסף שדה label בעברית
    shifts: shifts.filter((s) => s.Day === value),
  }));
  const todayEnumValue = (() => {
    const jsDay = today.day();
    const enumValues = daysArray.map(([key, value]) => value);
    return enumValues[jsDay] || enumValues[0];
  })();
  // מערכת יומית
  const todayShifts = shifts.filter((s) => s.Day === todayEnumValue);
  // מערכת שעתית (Timeline)
  const timelineItems = todayShifts.length
    ? todayShifts.map((s) => ({
      children: (
        <span>
          <HomeOutlined /> דירה: <b>{s.AppartmentId}</b> <br />
          <ClockCircleOutlined /> {s.StartTime} - {s.EndTime} <br />
          {s.Comments && (
            <>
              <InfoCircleOutlined /> {s.Comments}
            </>
          )}
        </span>
      ),
      color: "blue",
    }))
    : [
      {
        children: (
          <span>
            <SmileOutlined /> אין משמרות להיום! <br />
            <Text type="secondary">תהנה מהיום שלך</Text>
          </span>
        ),
        color: "green",
      },
    ];
  // טבלת עמודות - ימים רק מה-enum
  const columns = [
    {
      title: "דירה",
      dataIndex: "AppartmentId",
      key: "AppartmentId",
      render: (id) => (
        <span>
          <HomeOutlined style={{ color: "black", marginLeft: 6 }} />
          <Text strong>{id}</Text>
        </span>
      ),
    },
    {
      title: "יום בשבוע",
      dataIndex: "Day",
      key: "Day",
      filters: daysArray.map(([key, value]) => ({
        text: key,
        value: value,
      })),
      onFilter: (value, record) => record.Day === value,
      render: (day) => (
        <Tag color={"black"} style={{ fontWeight: "bold", fontSize: 15, background: "#e6f7ff", border: "none", color: "black" }}>
          {daysArray.find(([k, v]) => v === day)?.[0] || day}
        </Tag>
      ),
    },
    {
      title: "שעת התחלה",
      dataIndex: "StartTime",
      key: "StartTime",
      render: (time) => (
        <Tag color={"black"} style={{ fontWeight: "bold", background: "#f0f5ff", border: "none" }}>
          <ClockCircleOutlined style={{ color: "black" }} /> {time}
        </Tag>
      ),
      sorter: (a, b) => a.StartTime.localeCompare(b.StartTime),
    },
    {
      title: "שעת סיום",
      dataIndex: "EndTime",
      key: "EndTime",
      render: (time) => (
        <Tag color={"black"} style={{ fontWeight: "bold", background: "#f0f5ff", border: "none" }}>
          <ClockCircleOutlined style={{ color: "black" }} /> {time}
        </Tag>
      ),
      sorter: (a, b) => a.EndTime.localeCompare(b.EndTime),
    },
    {
      title: "הערות",
      dataIndex: "Comments",
      key: "Comments",
      render: (txt) =>
        txt ? (
          <Tooltip title={txt}>
            <InfoCircleOutlined style={{ color: calmBlue }} /> {txt}
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
  ];
// פידבקים/הודעות מהמערכת (דוגמה)
const systemMessages = [
  {
    type: "info",
    icon: <MessageOutlined />,
    content: "זכור להגיע בזמן לכל דירה ולסמן סיום משמרת באפליקציה.",
  },
  {
    type: "success",
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    content: "כל הכבוד! השלמת 100 משמרות החודש.",
  },
  {
    type: "warning",
    icon: <BulbOutlined />,
    content: "טיפ: מומלץ להביא כפפות חד פעמיות לכל משמרת.",
  },
];

// ...existing code...

return (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24, background: "#f4f8fd" }}>
    {/* ברכת פתיחה */}
    <Card
      style={{
        marginBottom: 32,
        borderRadius: 18,
        boxShadow: "0 2px 16px #1976d211",
        background: "linear-gradient(90deg, #e3f0ff 0%, #f9fbfd 100%)",
      }}
    >
      <Row align="middle" gutter={24}>
        <Col>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{ background: "#1976d222", color: "#1976d2" }}
          />
        </Col>
        <Col flex="auto">
          <Title level={2} style={{ margin: 0, color: "#223a5e" }}>
            שלום {user?.FirstName} {user?.LastName}!
          </Title>
          <Text style={{ fontSize: 18, color: "#4b587c" }}>
            ברוך הבא לדף הבית שלך כמנקה בדיור המוגן. כאן תוכל לראות את כל המשמרות, המידע והטיפים שיעזרו לך להצליח.
          </Text>
        </Col>
      </Row>
    </Card>

    {/* סטטיסטיקות */}
    <Row gutter={24} style={{ marginBottom: 32 }}>
      <Col xs={24} sm={8}>
        <Card bordered={false} style={{ borderRadius: 16, background: "#e3f2fd" }}>
          <Statistic
            title="סך הכל משמרות"
            value={totalShifts}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#1976d2" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card bordered={false} style={{ borderRadius: 16, background: "#e8f5e9" }}>
          <Statistic
            title="דירות שונות"
            value={apartments}
            prefix={<HomeOutlined />}
            valueStyle={{ color: "#388e3c" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card bordered={false} style={{ borderRadius: 16, background: "#fffde7" }}>
          <Statistic
            title="ימים פעילים בשבוע"
            value={uniqueDays}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#fbc02d" }}
          />
        </Card>
      </Col>
    </Row>

    {/* מערכת שבועית */}
    <Card
      title={
        <Space>
          <CalendarOutlined style={{ color: "#1976d2" }} />
          מערכת שבועית
        </Space>
      }
      style={{
        marginBottom: 32,
        borderRadius: 18,
        background: "linear-gradient(90deg, #e3f0ff 0%, #f9fbfd 100%)",
        boxShadow: "0 2px 16px #1976d211",
      }}
    >
      <Row gutter={16}>
        {weekSchedule.map((day) => (
          <Col xs={24} sm={12} md={6} key={day.value} style={{ marginBottom: 16 }}>
            <Card
              size="small"
              title={
                <span style={{ fontWeight: "bold", color: "#1976d2", fontSize: 18 }}>
                  {day.label}
                </span>
              }
              bordered={false}
              style={{
                minHeight: 120,
                background: "#f5faff",
                borderRadius: 12,
                boxShadow: "0 1px 6px #1976d208",
              }}
            >
              {day.shifts.length ? (
                day.shifts.map((s, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <Tag
                      color="#e3f2fd"
                      style={{
                        color: "#1976d2",
                        fontWeight: "bold",
                        border: "none",
                        fontSize: 15,
                        background: "#e3f2fd",
                      }}
                    >
                      <ClockCircleOutlined /> {s.StartTime} - {s.EndTime}
                    </Tag>
                    <Tag
                      color="#bbdefb"
                      style={{
                        color: "#0d47a1",
                        fontWeight: "bold",
                        border: "none",
                        fontSize: 15,
                        background: "#bbdefb",
                      }}
                    >
                      <HomeOutlined /> {s.AppartmentId}
                    </Tag>
                  </div>
                ))
              ) : (
                <Empty description="אין משמרות" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>

    {/* מערכת יומית */}
    <Card
      title={
        <Space>
          <ThunderboltOutlined style={{ color: "#1976d2" }} />
          המשמרות שלי להיום ({hebrewDays[today.format("dddd").toLowerCase()] || today.format("dddd")})
        </Space>
      }
      style={{
        marginBottom: 32,
        borderRadius: 18,
        background: "#f5faff",
      }}
      extra={
        <Button onClick={() => setToday(dayjs())} icon={<ReloadOutlined />} size="small" style={{ color: "#1976d2", borderColor: "#1976d2" }}>
          היום
        </Button>
      }
    >
      <Timeline
        mode="left"
        items={timelineItems.map(item => ({
          ...item,
          color: "#1976d2"
        }))}
      />
    </Card>

    {/* טבלת משמרות עם חיפוש */}
    <Card
      title={
        <Space>
          <HomeOutlined style={{ color: "#1976d2" }} />
          כל המשמרות שלי
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#fafdff",
        marginBottom: 32,
      }}
      extra={
        <Search
          placeholder="חפש דירה, יום או הערה"
          allowClear
          onSearch={setSearch}
          style={{ width: 220 }}
          enterButton
        />
      }
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredShifts}
          columns={columns.map(col => {
            if (col.dataIndex === "Day") {
              return {
                ...col,
                render: (day) => (
                  <Tag
                    color="#e3f2fd"
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      border: "none",
                      color: "#1976d2",
                    }}
                  >
                    {hebrewDays[(daysArray.find(([k, v]) => v === day)?.[0] || day).toLowerCase()] || day}
                  </Tag>
                ),
              };
            }
            if (col.dataIndex === "StartTime" || col.dataIndex === "EndTime") {
              return {
                ...col,
                render: (time) => (
                  <Tag
                    color="#bbdefb"
                    style={{
                      fontWeight: "bold",
                      border: "none",
                      color: "#0d47a1",
                    }}
                  >
                    <ClockCircleOutlined style={{ color: "#1976d2" }} /> {time}
                  </Tag>
                ),
              };
            }
            if (col.dataIndex === "AppartmentId") {
              return {
                ...col,
                render: (id) => (
                  <span>
                    <HomeOutlined style={{ color: "#1976d2", marginLeft: 6 }} />
                    <Text strong style={{ color: "#1976d2" }}>{id}</Text>
                  </span>
                ),
              };
            }
            return col;
          })}
          rowKey="_id"
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: "אין משמרות פעילות" }}
          style={{ direction: "rtl" }}
          bordered
          size="middle"
        />
      )}
    </Card>

    {/* הודעות מהמערכת */}
    <Card
      title={
        <Space>
          <MessageOutlined style={{ color: "#1976d2" }} />
          הודעות מהמערכת
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#e3f2fd",
        marginBottom: 32,
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {systemMessages.map((msg, idx) => (
          <Alert
            key={idx}
            message={msg.content}
            type={msg.type}
            icon={msg.icon}
            showIcon
            style={{ fontSize: 16, background: "#fafdff", border: "none" }}
          />
        ))}
      </Space>
    </Card>

    {/* טיפים למנקה */}
    <Card
      title={
        <Space>
          <BulbOutlined style={{ color: "#1976d2" }} />
          פינת הטיפים
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#e3f2fd",
        marginBottom: 32,
      }}
    >
      <ul style={{ fontSize: 16, color: "#4b587c", marginRight: 24 }}>
        <li>הקפד על הופעה ייצוגית ונקייה.</li>
        <li>השתמש בחומרי ניקוי איכותיים ובטוחים.</li>
        <li>שמור על יחס מכבד לדיירים ולסביבה.</li>
        <li>דווח על כל תקלה או בעיה למנהל.</li>
        <li>היה קשוב לבקשות מיוחדות של הדיירים.</li>
      </ul>
    </Card>

    {/* יצירת קשר עם אחראי/בעלים */}
    <Card
      title={
        <Space>
          <UserOutlined style={{ color: "#1976d2" }} />
          יצירת קשר עם אחראי/בעלים
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#f5faff",
        marginBottom: 32,
      }}
    >
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{ background: "#e3f2fd", borderRadius: 12, marginBottom: 16 }}
          >
            <Title level={5} style={{ marginBottom: 0, color: "#1976d2" }}>
              אחראי משמרות
            </Title>
            <Text>שם: רות כהן</Text>
            <br />
            <Text>טלפון: <a href="tel:052-1234567">052-1234567</a></Text>
            <br />
            <Text>אימייל: <a href="mailto:manager@home.co.il">manager@home.co.il</a></Text>
            <br />
            <Button
              type="primary"
              icon={<MessageOutlined />}
              style={{ marginTop: 8, background: "#1976d2", borderColor: "#1976d2" }}
              onClick={() => window.open("mailto:manager@home.co.il")}
            >
              שלח הודעה
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{ background: "#fffde7", borderRadius: 12, marginBottom: 16 }}
          >
            <Title level={5} style={{ marginBottom: 0, color: "#1976d2" }}>
              בעלים/מנהל ראשי
            </Title>
            <Text>שם: יוסי לוי</Text>
            <br />
            <Text>טלפון: <a href="tel:050-7654321">050-7654321</a></Text>
            <br />
            <Text>אימייל: <a href="mailto:owner@home.co.il">owner@home.co.il</a></Text>
            <br />
            <Button
              type="dashed"
              icon={<MessageOutlined />}
              style={{ marginTop: 8, color: "#1976d2", borderColor: "#1976d2" }}
              onClick={() => window.open("mailto:owner@home.co.il")}
            >
              שלח הודעה
            </Button>
          </Card>
        </Col>
      </Row>
    </Card>

    {/* הישגים אישיים */}
    <Card
      title={
        <Space>
          <CheckCircleTwoTone twoToneColor="#388e3c" />
          ההישגים שלי
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#e8f5e9",
        marginBottom: 32,
      }}
    >
      <Row gutter={24}>
        <Col xs={24} sm={8}>
          <Statistic
            title="משמרות מוצלחות ברצף"
            value={12}
            prefix={<ThunderboltOutlined />}
            valueStyle={{ color: "#388e3c" }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="חוות דעת חיוביות"
            value={37}
            prefix={<SmileOutlined />}
            valueStyle={{ color: "#1976d2" }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="ותק במערכת (חודשים)"
            value={18}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#fbc02d" }}
          />
        </Col>
      </Row>
    </Card>

    {/* אזור קבצים להורדה */}
    <Card
      title={
        <Space>
          <InfoCircleOutlined style={{ color: "#1976d2" }} />
          מסמכים חשובים להורדה
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#fafdff",
        marginBottom: 32,
      }}
    >
      <ul style={{ fontSize: 16, color: "#4b587c", marginRight: 24 }}>
        <li>
          <a href="/docs/cleaning-guidelines.pdf" target="_blank" rel="noopener noreferrer">
            הנחיות ניקיון - PDF
          </a>
        </li>
        <li>
          <a href="/docs/safety-rules.pdf" target="_blank" rel="noopener noreferrer">
            כללי בטיחות - PDF
          </a>
        </li>
        <li>
          <a href="/docs/contact-list.xlsx" target="_blank" rel="noopener noreferrer">
            רשימת אנשי קשר - Excel
          </a>
        </li>
      </ul>
    </Card>

    {/* שאלות ותשובות נפוצות */}
    <Card
      title={
        <Space>
          <BulbOutlined style={{ color: "#1976d2" }} />
          שאלות ותשובות נפוצות
        </Space>
      }
      style={{
        borderRadius: 18,
        background: "#e3f2fd",
        marginBottom: 32,
      }}
    >
      <ul style={{ fontSize: 16, color: "#4b587c", marginRight: 24 }}>
        <li>
          <b>מה עושים אם אני מאחר?</b>
          <br />
          יש לעדכן את האחראי בהקדם האפשרי וליידע את הדייר.
        </li>
        <li>
          <b>איך מדווחים על תקלה?</b>
          <br />
          ניתן לפנות לאחראי דרך הכפתור למעלה או לשלוח מייל.
        </li>
        <li>
          <b>האם אפשר להחליף משמרת?</b>
          <br />
          כן, בתיאום מראש עם האחראי בלבד.
        </li>
      </ul>
    </Card>

    {/* Footer */}
    <div style={{ textAlign: "center", color: "#888", marginTop: 40, marginBottom: 10 }}>
      <Divider />
      <Text>
        מערכת ניהול דיור מוגן &copy; {new Date().getFullYear()} | כל הזכויות שמורות
      </Text>
    </div>
  </div>
);

}

export default CleanerHome;
