import React, { useEffect, useState } from 'react';
import { Row, Col, message } from 'antd';
import axios from 'axios';
import ApartmentCard from './ApartmentCard';
import { Link } from 'react-router-dom';

const ApartmentsList = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/Apartment/getAll')
      .then(response => {
        setApartments(response.data);
      })
      .catch(() => {
        message.error('שגיאה בטעינת הדירות');
      });
  }, []);

  return (
    <Row gutter={[16, 16]} style={{ padding: '24px' }}>
      {apartments.map(apartment => (
        <Col xs={24} sm={12} md={8} lg={6} key={apartment._id}>
          <Link to={`/apartments/${apartment._id}`}>
            <ApartmentCard apartment={apartment} />
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default ApartmentsList;
