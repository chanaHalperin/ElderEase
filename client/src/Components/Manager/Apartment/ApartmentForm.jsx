import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Upload, message, Row, Col, Card, Radio } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import AploadPicture from '../../AploadPicture';

const { Option } = Select;
const { Dragger } = Upload;

const ApartmentForm = () => {
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [apartmentPlan, setApartmentPlan] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // פונקציה להעלאת התמונות
  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      // שמירת שם הקובץ כולל הסיומת
      const fileNameWithExtension = info.file.name;  // שם הקובץ עם הסיומת (למשל: "image1.jpg")
  
      setImageList(prevList => [
        ...prevList,
        fileNameWithExtension  // הוספת שם הקובץ לרשימה
      ]);
  
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // פונקציה לשליחת הנתונים לשרת
  const onFinish = async (values) => {
    const apartmentData = {
      Id: values.Id,
      Floor: values.Floor,
      NumOfRooms: values.NumOfRooms,
      IsView: values.IsView, // כאן נשלח את ערך ה-boolean עבור נוף
      MonthlyPrice: values.MonthlyPrice,
      SizeInSquareMeters: values.SizeInSquareMeters,
      Status: values.Status,
      Images: imageList, // המערך של התמונות שהועלו
      ApartmentPlan: imageUrl, // תכנית הדירה שהועלתה
    };

    try {
      const response = await axios.post('http://localhost:8080/Apartment/create', apartmentData);
      message.success('Apartment added successfully');
      form.resetFields();
      setImageList([]); // איפוס המערך
      setApartmentPlan(null); // איפוס תמונת תכנית הדירה
    } catch (error) {
      message.error('Failed to add apartment');
    }
  };

  return (
    <Row justify="center" style={{ padding: '50px', width: '100%' }}>
      <Col span={24}>
        <Card title="Add New Apartment" variant="outlined">
          <Form form={form} onFinish={onFinish} layout="vertical">
            {/* שדות הטופס */}
            <Form.Item label="Apartment ID" name="Id" rules={[{ required: true, message: 'Please input the apartment ID!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item label="Floor" name="Floor" rules={[{ required: true, message: 'Please input the floor number!' }]}>
              <InputNumber style={{ width: '100%' }} min={-4} />
            </Form.Item>

            <Form.Item label="Number of Rooms" name="NumOfRooms" rules={[{ required: true, message: 'Please input the number of rooms!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} max={5} />
            </Form.Item>

            {/* שדה נוף עם כפתורי רדיו */}
            <Form.Item label="Is there a view?" name="IsView" rules={[{ required: true, message: 'Please select if there is a view!' }]}>
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Monthly Price" name="MonthlyPrice" rules={[{ required: true, message: 'Please input the monthly price!' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item label="Size in Square Meters" name="SizeInSquareMeters" rules={[{ required: true, message: 'Please input the size!' }]}>
              <InputNumber style={{ width: '100%' }} min={10} />
            </Form.Item>

            <Form.Item label="Apartment Status" name="Status" rules={[{ required: true, message: 'Please select the apartment status!' }]}>
              <Select style={{ width: '100%' }}>
                <Option value="available">Available</Option>
                <Option value="occupied">Occupied</Option>
                <Option value="maintenance">Maintenance</Option>
              </Select>
            </Form.Item>

            {/* רכיב העלאת תכנית הדירה */}
            <Form.Item label="Apartment Plan" name="ApartmentPlan">
              <AploadPicture setImageUrl={setImageUrl} />
            </Form.Item>

            {/* רכיב העלאת התמונות */}
            <Form.Item label="Upload Images" name="Images">
              <Dragger
                name="file"
                multiple={true}  // אפשרות להעלות מספר תמונות
                action="http://localhost:8080/upload"  // כתובת להעלאת התמונות
                onChange={handleImageChange}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag images to this area to upload</p>
              </Dragger>
            </Form.Item>

            {/* כפתור הוספה */}
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Add Apartment
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ApartmentForm;
