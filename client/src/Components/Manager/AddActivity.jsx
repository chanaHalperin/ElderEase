import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Typography,
  Card,
} from 'antd';
import { useState } from "react";
import axios from 'axios';
import AploadPicture from '../AploadPicture';
import { useEnum } from "../../Enums/useEnum";
const { Title } = Typography;

const AddActivity = ({ openNotification, scrollToTop, setShowAddActivity }) => {
  const [loadingg, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = React.useState(null);
  const { data, loading, error } = useEnum("getActivityCategory");

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        Id: values.Id,
        Name: values.Name,
        Date: values.Date.format('YYYY-MM-DD'),
        Location: values.Location,
        MakerName: values.MakerName,
        Price: values.Price,
        MaxParticipants: values.MaxParticipants,
        Category: values.Category,
        Image: imageUrl,
      };

      await axios.post('http://localhost:8080/Activity/create', formattedValues, { withCredentials: true });
      form.resetFields();
      setImageUrl(null);
      setShowAddActivity(false); // ← כאן הסגירה של החלון
      openNotification("success", "הפעילות נוספה בהצלחה!", "הפעילות החדשה נוספה למערכת.");
      scrollToTop && scrollToTop();
    } catch (error) {
      openNotification("error", "שגיאה בהוספת פעילות", "נסה שוב או פנה לתמיכה.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        .add-activity-card {
          background: #f9fbfd !important;
          border-radius: 18px;
          box-shadow: 0 2px 16px #223a5e11;
          padding: 32px 18px 18px 18px;
          margin-bottom: 24px;
        }
        .add-activity-form .ant-form-item {
          margin-bottom: 18px;
        }
        .add-activity-form .ant-form-item-label > label {
          font-weight: 500;
          color: #223a5e;
        }
        .add-activity-form .ant-input,
        .add-activity-form .ant-input-number,
        .add-activity-form .ant-select-selector {
          border-radius: 12px !important;
          background: #fff !important;
        }
        .add-activity-form .ant-btn-primary {
          background: #1890ff;
          border-radius: 22px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .add-activity-form .ant-btn-primary:hover {
          background: #40a9ff;
        }
        `}
      </style>
      {loading && <p>טוען...</p>}
      {error && <p>שגיאה בטעינת הקטגוריות</p>}
      {!loading && !error &&
        <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }} dir="rtl">
          <Card className="add-activity-card">
            <Title level={3} style={{ textAlign: 'right' }}>הוספת פעילות</Title>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              labelAlign="right"
              onFinish={onFinish}
              className="add-activity-form"
            >
              <Form.Item
                label="מזהה פעילות"
                name="Id"
                rules={[
                  { required: true, message: 'נא להזין מזהה פעילות' },
                  { min: 3, message: 'מזהה הפעילות חייב להיות לפחות 3 ספרות' },
                  { max: 10, message: 'מזהה הפעילות לא יכול להיות יותר מ-10 ספרות' }
                ]}
              >
                <Input placeholder="הכנס מזהה פעילות" />
              </Form.Item>

              <Form.Item
                label="שם פעילות"
                name="Name"
                rules={[
                  { required: true, message: 'נא להזין שם פעילות' },
                  { min: 2, message: 'שם הפעילות חייב להיות לפחות 2 תווים' },
                  { max: 100, message: 'שם הפעילות לא יכול להיות יותר מ-100 תווים' }
                ]}
              >
                <Input placeholder="הכנס שם פעילות" />
              </Form.Item>

              <Form.Item
                label="תאריך"
                name="Date"
                rules={[{ required: true, message: 'נא לבחור תאריך' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                label="מיקום"
                name="Location"
                rules={[
                  { required: true, message: 'נא להזין מיקום' },
                  { min: 2, message: 'המיקום חייב להיות לפחות 2 תווים' },
                  { max: 100, message: 'המיקום לא יכול להיות יותר מ-100 תווים' }
                ]}
              >
                <Input placeholder="הכנס מיקום" />
              </Form.Item>

              <Form.Item
                label="שם יוזם"
                name="MakerName"
                rules={[
                  { required: true, message: 'נא להזין שם יוזם' },
                  { min: 2, message: 'שם היוזם חייב להיות לפחות 2 תווים' },
                  { max: 50, message: 'שם היוזם לא יכול להיות יותר מ-50 תווים' }
                ]}
              >
                <Input placeholder="שם יוזם הפעילות" />
              </Form.Item>

              <Form.Item
                label="מחיר"
                name="Price"
                rules={[
                  { required: true, message: 'נא להזין מחיר' },
                  { type: 'number', min: 0, message: 'המחיר לא יכול להיות שלילי' }
                ]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="מחיר (₪)" />
              </Form.Item>

              <Form.Item
                label="מספר משתתפים"
                name="MaxParticipants"
                rules={[
                  { required: true, message: 'נא להזין מספר משתתפים' },
                  { type: 'number', min: 50, message: 'מינימום 50 משתתפים' }
                ]}
              >
                <InputNumber min={50} style={{ width: '100%' }} placeholder="מספר משתתפים לפחות 50" />
              </Form.Item>

              <Form.Item
                label="קטגוריה"
                name="Category"
                rules={[{ required: true, message: 'נא לבחור קטגוריה' }]}
              >
                <Select placeholder="בחר קטגוריה">
                  {data && typeof data === "object" && Object.values(data).map((cat, idx) => (
                    <Select.Option key={idx} value={cat}>{cat}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="תמונה">
                <AploadPicture setImageUrl={setImageUrl} />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loadingg}>
                  שמור פעילות
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      }
    </>
  );
};
export default AddActivity;