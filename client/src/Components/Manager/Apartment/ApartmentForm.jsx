import { useState } from 'react';
import { Form, InputNumber, Select, Button, Upload, message, Card, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import AploadPicture from '../../AploadPicture';
const { Option } = Select;
const { Dragger } = Upload;

const ApartmentForm = ({ openNotification, scrollToTop, setShowAddApartment  }) => {
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  // פונקציה להעלאת התמונות
  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      const fileNameWithExtension = info.file.name;
      setImageList(prevList => [
        ...prevList,
        fileNameWithExtension
      ]);

    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} נכשל בהעלאה`);
    }
  };

  // פונקציה לשליחת הנתונים לשרת
  const onFinish = async (values) => {
    const apartmentData = {
      Id: values.Id,
      Floor: values.Floor,
      NumOfRooms: values.NumOfRooms,
      IsView: values.IsView,
      MonthlyPrice: values.MonthlyPrice,
      SizeInSquareMeters: values.SizeInSquareMeters,
      Status: values.Status,
      Images: imageList,
      ApartmentPlan: imageUrl,
    };

    try {
      await axios.post('http://localhost:8080/Apartment/create', apartmentData, { withCredentials: true });
      message.success('הדירה נוספה בהצלחה');
      form.resetFields();
      setImageList([]);
      openNotification("success", "הדירה נוספה בהצלחה!", "הדירה החדשה נוספה למערכת.");
      setShowAddApartment(false); // סגור את החלון
      scrollToTop && scrollToTop();
    } catch (error) {
      openNotification?.('error', "שגיאה בשמירה", "התרחשה תקלה בעת שמירת נתוני הדירה. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <>
      <style>
        {`
        .apartment-form-card {
          background: #f9fbfd !important;
          border-radius: 18px;
          box-shadow: 0 2px 16px #223a5e11;
          padding: 32px 18px 18px 18px;
          margin-bottom: 24px;
        }
        .apartment-form .ant-form-item {
          margin-bottom: 18px;
        }
        .apartment-form .ant-form-item-label > label {
          font-weight: 500;
          color: #223a5e;
        }
        .apartment-form .ant-input,
        .apartment-form .ant-input-number,
        .apartment-form .ant-select-selector {
          border-radius: 12px !important;
          background: #fff !important;
        }
        .apartment-form .ant-btn-primary {
          background: #52c41a;
          border-radius: 22px;
          font-size: 1.1rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .apartment-form .ant-btn-primary:hover {
          background: #73d13d;
        }
        .apartment-form .ant-radio-group {
          gap: 16px;
        }
        `}
      </style>
      <div style={{ maxWidth: 800, margin: 'auto', padding: '20px' }} dir="rtl">
        <Card className="apartment-form-card" title="הוספת דירה חדשה" headStyle={{ textAlign: 'right', fontWeight: 700 }}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="apartment-form"
          >
            <Form.Item label="מזהה דירה" name="Id" rules={[{ required: true, message: 'נא להזין מזהה דירה!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item label="קומה" name="Floor" rules={[{ required: true, message: 'נא להזין קומה!' }]}>
              <InputNumber style={{ width: '100%' }} min={-4} />
            </Form.Item>
            <Form.Item label="מספר חדרים" name="NumOfRooms" rules={[{ required: true, message: 'נא להזין מספר חדרים!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} max={5} />
            </Form.Item>
            <Form.Item label="נוף" name="IsView" rules={[{ required: true, message: 'נא לבחור אם יש נוף!' }]}>
              <Radio.Group>
                <Radio value={true}>יש</Radio>
                <Radio value={false}>אין</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="מחיר חודשי" name="MonthlyPrice" rules={[{ required: true, message: 'נא להזין מחיר חודשי!' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item label="גודל במטר" name="SizeInSquareMeters" rules={[{ required: true, message: 'נא להזין גודל!' }]}>
              <InputNumber style={{ width: '100%' }} min={10} />
            </Form.Item>
            <Form.Item label="סטטוס דירה" name="Status" rules={[{ required: true, message: 'נא לבחור סטטוס!' }]}>
              <Select style={{ width: '100%' }}>
                <Option value="available">פנויה</Option>
                <Option value="occupied">תפוסה</Option>
                <Option value="maintenance">תחזוקה</Option>
              </Select>
            </Form.Item>
            <Form.Item label="תכנית דירה" name="ApartmentPlan">
              <AploadPicture setImageUrl={setImageUrl} />
            </Form.Item>
            <Form.Item label="העלאת תמונות" name="Images">
              <Dragger
                name="file"
                multiple={true}
                action="http://localhost:8080/upload"
                onChange={handleImageChange}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">לחץ או גרור תמונות לכאן להעלאה</p>
              </Dragger>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                הוסף דירה
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default ApartmentForm;