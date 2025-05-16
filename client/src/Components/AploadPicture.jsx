import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';

const AploadPicture = ({ setImageUrl }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = info => {
    let newFileList = [...info.fileList].slice(-1); // רק תמונה אחת
  
    newFileList = newFileList.map(file => {
      if (file.status === 'done' && file.response?.name) { // הנח שהתגובה מכילה את שם הקובץ
        const fileName = file.response.name; // קבלת שם הקובץ
       console.log(fileName); // הדפסת שם הקובץ לקונסולה
        setImageUrl(fileName); // עדכון ה־imageUrl החיצוני עם שם הקובץ
      } else if (file.status === 'error') {
        message.error(`העלאת הקובץ נכשלה: ${file.name}`);
      }
      return file;
    });
  
    setFileList(newFileList);
  };
  

  const props = {
    action: 'http://localhost:8080/upload',
    onChange: handleChange,
    multiple: false,
    accept: 'image/*',
  };

  return (
    <Upload {...props} fileList={fileList} listType="picture">
      <Button icon={<UploadOutlined />}>העלה תמונה</Button>
    </Upload>
  );
};

export default AploadPicture;
