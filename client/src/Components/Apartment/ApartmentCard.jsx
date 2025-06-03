import React from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';

const ApartmentCard = ({ apartment, onShowDetails }) => {
  return (
    <Card
      hoverable
      style={{
        width: '100%',
        borderRadius: '14px',
        boxShadow: '0 4px 18px #223a5e11',
        transition: 'transform 0.2s',
        height: 270,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
      }}
      bodyStyle={{ padding: '12px 12px 8px 12px' }}
      cover={
        <img
          alt="תמונה של הדירה"
          src={apartment.Images?.[0]
            ? `http://localhost:8080/uploads/${apartment.Images[0]}`
            : "https://via.placeholder.com/400x150?text=No+Image"}
          style={{
            height: 140,
            width: '100%',
            objectFit: 'cover',
            borderRadius: '14px 14px 0 0',
            background: '#f0f0f0'
          }}
        />
      }
    >
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <h4 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
          דירה מספר {apartment.Id}
        </h4>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        {onShowDetails && (
          <Button
            type="primary"
            block
            style={{ marginTop: 0 }}
            onClick={() => onShowDetails(apartment)}
            icon={<InfoCircleOutlined />}
          >
            פרטים נוספים
          </Button>
        )}
        {!onShowDetails && (
          <Link to={`/apartments/${apartment._id}`}>
            <Button block>
              פרטים נוספים
            </Button>
          </Link>)}
      </div>
    </Card>
  );
};

export default ApartmentCard;
