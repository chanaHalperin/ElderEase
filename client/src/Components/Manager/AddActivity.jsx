import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Typography,
  message,
  Card,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import AploadPicture from '../AploadPicture';
import { useEnum } from "../../Enums/useEnum"; // עדכון ה-import לנתיב הנכון
const { Title } = Typography;

const AddActivity = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const { data: categoriesArray, loading, error } = useEnum("getActivityCategory");

  useEffect(() => {
    axios.get('http://localhost:8080/Enums/getActivityCategory')
      .then(res => {
        const categoriesArray = Object.values(res.data);
        setCategories(categoriesArray);
      })
      .catch(err => {
        console.error('שגיאה בעת שליפת הקטגוריות:', err);
      });
  }, []);

  const onFinish = async (values) => {
    try {
        console.log('הנתונים שנשלחו:', values, imageUrl); // הדפסת הנתונים לקונסולה
      const formattedValues = {
        Id: values.Id,
        Name: values.Name,
        Date: values.Date.format('YYYY-MM-DD'),
        Location: values.Location,
        MakerName: values.MakerName,
        Price: values.Price,
        MaxParticipants: values.MaxParticipants,
        Category: values.Category,
        Image: imageUrl, // שמירת שם התמונה
      };

      await axios.post('http://localhost:8080/Activity/create', formattedValues);
      console.log('הנתונים נשלחו בהצלחה:', formattedValues); // הדפסת הנתונים שנשלחו לקונסולה
      message.success('הפעילות נוספה בהצלחה!');
      form.resetFields();
      //setImageUrl(null);
    } catch (error) {
      console.error('שגיאה בעת שליחת הנתונים:', error);
      message.error('אירעה שגיאה בעת יצירת הפעילות.');
    }
  };

  return (
  <>
  {loading && <p>טוען...</p>}
  {error && <p>שגיאה בטעינת הקטגוריות</p>}
  {!loading && !error && 
    <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }} dir="rtl">
      <Card style={{ background: '#fefefe' }}>
        <Title level={3} style={{ textAlign: 'right' }}>הוספת פעילות</Title>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          labelAlign="right"
          onFinish={onFinish}
        >
          <Form.Item
            label="מספר מזהה"
            name="Id"
            rules={[
              { required: true, message: 'נא להזין מזהה' },
              { type: 'number', min: 1, message: 'המזהה חייב להיות מספר חיובי' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="שם פעילות"
            name="Name"
            rules={[
              { required: true, message: 'נא להזין שם' },
              { min: 2, max: 100, message: 'השם חייב להכיל בין 2 ל-100 תווים' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="תאריך"
            name="Date"
            rules={[{ required: true, message: 'נא לבחור תאריך' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="מיקום"
            name="Location"
            rules={[
              { required: true, message: 'נא להזין מיקום' },
              { min: 2, max: 100, message: 'המיקום חייב להכיל בין 2 ל-100 תווים' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="שם מפעיל"
            name="MakerName"
            rules={[
              { required: true, message: 'נא להזין שם מפעיל' },
              { min: 2, max: 50, message: 'שם המפעיל חייב להכיל בין 2 ל-50 תווים' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="מחיר"
            name="Price"
            rules={[
              { required: true, message: 'נא להזין מחיר' },
              { type: 'number', min: 0, message: 'המחיר לא יכול להיות שלילי' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="מקסימום משתתפים"
            name="MaxParticipants"
            rules={[
              { required: true, message: 'נא להזין מספר משתתפים' },
              { type: 'number', min: 50, message: 'המספר המינימלי הוא 50' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="קטגוריה"
            name="Category"
            rules={[{ required: true, message: 'נא לבחור קטגוריה תקינה' }]}
          >
            <Select placeholder="בחר קטגוריה">
              {categories.map((cat, index) => (
                <Select.Option key={index} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="תמונה" name="Image">
            <AploadPicture setImageUrl={setImageUrl} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              שמור פעילות
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>}
    </>
  );
};

export default AddActivity;
