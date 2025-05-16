import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Descriptions, message, Button } from 'antd';
import axios from 'axios';
import ChooseAppButton from './ChooseAppButton';
import { useSelector } from 'react-redux';
const ApartmentDetails = () => {
  const { apartmentId } = useParams(); // מזהה הדירה
  const [apartment, setApartment] = useState(null);
  const user= useSelector((state) => state.user); // פרטי המשתמש הנוכחי
  useEffect(() => {
    // שליפת פרטי הדירה לפי ה-ID
    axios.get(`http://localhost:8080/Apartment/getById/${apartmentId}`)
      .then(response => {
        setApartment(response.data);
      })
      .catch(() => {
        message.error('שגיאה בטעינת פרטי הדירה');
      });
  }, [apartmentId]);

  // אם הדירה עדיין לא טוענה, מציגים הודעת "טוען..."
  if (!apartment) return <div>טוען...</div>;



  return (
    <Row style={{ padding: '24px' }}>
      <Col span={24}>
        <Card
          title={`פרטי דירה מספר ${apartment.Id}`}
          style={{ width: '100%' }}
          cover={<img alt="תמונה של הדירה" src={`http://localhost:8080/uploads/${apartment.Images?.[0]}`} />}
        >
          <Descriptions bordered>
            <Descriptions.Item label="מספר דירה">{apartment.Id}</Descriptions.Item>
            <Descriptions.Item label="שם הדירה">{apartment.Name}</Descriptions.Item>
            <Descriptions.Item label="מיקום">{apartment.Location}</Descriptions.Item>
            <Descriptions.Item label="מחיר">{apartment.MonthlyPrice} ₪</Descriptions.Item>
            <Descriptions.Item label="גודל">{apartment.SizeInSquareMeters} מ"ר</Descriptions.Item>
            <Descriptions.Item label="מקסימום משתתפים">{apartment.MaxParticipants}</Descriptions.Item>
            <Descriptions.Item label="תאריך">{apartment.Date}</Descriptions.Item>
          </Descriptions>

          {/* כפתור "בחירת דירה" */}
          {user.Status==="confirmed"&& user.Role==="elderly"&&
          <ChooseAppButton apartmentId={apartment._id} elderlyId={user._id}/>}
        </Card>
      </Col>
    </Row>
  );
};

export default ApartmentDetails;
