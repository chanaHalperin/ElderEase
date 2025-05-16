import React, { useState } from 'react';
import { Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import QueueTable from './QueueTable';  // נניח שזו הדרך לייבא את QueueTable

const GetQueueByRole = ({currentRole}) => {
  const [showQueue, setShowQueue] = useState(false);
  const role = currentRole;
  const handleButtonClick = () => {
    setShowQueue(true);  // מציג את הקומפוננטה לאחר לחיצה
  };

  return (
    <>
      {!showQueue && (
        <Button 
          type="default" 
          icon={<InfoCircleOutlined />} 
          style={{
            borderColor: '#1890ff',
            color: '#1890ff',
            borderRadius: '12px',
            fontWeight: '500',
            padding: '0 20px',
            height: '40px'
          }}
          onClick={handleButtonClick}  // קישור לפונקציה בלחיצה
        >
           {role}
        </Button>
      )}

      {showQueue && <QueueTable currentRole={role} />}  {/* הצגת הקומפוננטה QueueTable */}
    </>
  );
};

export default GetQueueByRole;
