import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Descriptions, message, Tag, Carousel, Typography, Divider, Button } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const ApartmentDetails = ({ apartmentId: propApartmentId, onChoose }) => {
  const params = useParams();
  const apartmentId = propApartmentId || params.apartmentId;
  const [apartment, setApartment] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!apartmentId) return;
    axios.get(`http://localhost:8080/Apartment/getById/${apartmentId}`)
      .then(response => {
        setApartment(response.data);
      }, { withCredentials: true })
      .catch(() => {
        message.error('שגיאה בטעינת פרטי הדירה');
      });
  }, [apartmentId]);

  if (!apartment) return <div style={{ textAlign: "center", marginTop: 40 }}>טוען...</div>;
  // תצוגת סטטוס
  const statusColor = apartment.Status === "available" || apartment.Status === "פנויה" ? "green" : "red";
  const statusLabel = apartment.Status === "available" ? "פנויה" : apartment.Status === "unavailable" ? "תפוסה" : apartment.Status;
  // const handleChoose = () => {
  //   // נשלח את מזהה הדירה חזרה ל-parent דרך ה-state של הניווט
  //   navigate(-1, { state: { selectedApartment: apartment._id } });
  // };
  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} md={20} lg={16}>
        <Card
          style={{
            borderRadius: 18,
            boxShadow: "0 2px 16px #223a5e11",
            background: "#f9fbfd",
            marginBottom: 24
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* גלריית תמונות */}
          <Carousel autoplay dots={apartment.Images?.length > 1} style={{ borderRadius: "18px 18px 0 0" }}>
            {(apartment.Images && apartment.Images.length > 0 ? apartment.Images : [null]).map((img, idx) => (
              <div key={idx}>
                <img
                  alt="תמונה של הדירה"
                  src={img ? `http://localhost:8080/uploads/${img}` : "https://via.placeholder.com/600x250?text=No+Image"}
                  style={{
                    width: "100%",
                    height: 260,
                    objectFit: "cover",
                    borderRadius: "18px 18px 0 0"
                  }}
                />
              </div>
            ))}
          </Carousel>

          <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 0 }}>
              דירה מספר {apartment.Id}
              <Tag color={statusColor} style={{ marginRight: 12, fontSize: "1em" }}>
                {statusLabel}
              </Tag>
            </Title>
            <Divider style={{ margin: "12px 0" }} />

            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, md: 2 }}
              labelStyle={{ fontWeight: 500, width: 120 }}
              contentStyle={{ background: "#fff" }}
            >
              <Descriptions.Item label="מספר דירה">{apartment.Id}</Descriptions.Item>
              <Descriptions.Item label="קומה">{apartment.Floor}</Descriptions.Item>
              <Descriptions.Item label="מס' חדרים">{apartment.NumOfRooms}</Descriptions.Item>
              <Descriptions.Item label="נוף">{apartment.IsView ? "כן" : "לא"}</Descriptions.Item>
              <Descriptions.Item label="מחיר">{apartment.MonthlyPrice} ₪</Descriptions.Item>
              <Descriptions.Item label="גודל">{apartment.SizeInSquareMeters} מ"ר</Descriptions.Item>
              <Descriptions.Item label="סטטוס">{statusLabel}</Descriptions.Item>
              {apartment.ApartmentPlan && (
                <Descriptions.Item label="תכנית דירה">
                  <a href={`http://localhost:8080/uploads/${apartment.ApartmentPlan}`} target="_blank" rel="noopener noreferrer">
                    לצפייה
                  </a>
                </Descriptions.Item>
              )}
              {apartment.Comments && (
                <Descriptions.Item label="הערות">{apartment.Comments}</Descriptions.Item>
              )}
            </Descriptions>

            {/* כפתור "בחירת דירה" */}
            {onChoose && user.Status === "confirmed" && user.Role === "elderly" && (
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Button type="primary" block onClick={() => onChoose(apartmentId)}>
                  בחר דירה זו
                </Button>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ApartmentDetails;