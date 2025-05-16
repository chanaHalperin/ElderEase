import React from 'react';
import { Card } from 'antd';

const ApartmentCard = ({ apartment }) => {
  return (
    <Card
      hoverable
      style={{
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        height: '250px',  // הגובה של הכרטיס השוכב
      }}
      cover={
        <img
          alt="תמונה של הדירה"
          src={`http://localhost:8080/uploads/${apartment.Images?.[0]}`}
          style={{
            height: '150px',  // הגובה של התמונה
            width: '100%',    // רוחב התמונה שתהיה בגודל הכרטיס
            objectFit: 'cover',
            borderRadius: '8px 8px 0 0', // עיגול רק לפינות העליונות
          }}
        />
      }
    >
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>
          דירה מספר {apartment.Id}
        </h4>
      </div>
    </Card>
  );
};

export default ApartmentCard;
