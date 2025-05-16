
import React, { useLayoutEffect, useState } from "react";
import { Modal, Form, Select, Button, Spin } from "antd";
import { useEnum } from "../../Enums/useEnum";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "../../Store/UserSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendEmail } from '../../SendEmail';
const { Option } = Select;

const CleanerDaysModal = ({ onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
const navigate = useNavigate();
  const [visible, setVisible] = useState(true); // טופס נפתח אוטומטית

  const {
    data: dayInWork,
    loading: loadingDayInWeek,
    error: errorDayInWeek,
  } = useEnum("getDayInWeek");
    const {
    data: userStatus,
    loading: loadinguserStatus,
    error: erroruserStatus,
  } = useEnum("getUserStatus");
  const onFinish =async (values) => {
    const FinalString = JSON.stringify(values.dayInWork);
    console.log("ערכים שנבחרו:", FinalString);
    await createCleanerFinal(FinalString);
    console.log("נשלחו בהצלחה!");
    dispatch(setUser({ Status: userStatus.ACTIVE}));
    //האם לנווט פה?
     setVisible(false);
     navigate("/HomeCleaner");
    
  };
  const userData = localStorage.getItem("user");
  const user= userData ? JSON.parse(userData) : useSelector((state) => state.user);
  async function createCleanerFinal(values) {
    console.log("ערכים לפני שליחה (createCleanerFinal):",user.Status,
      user._id, 
      values, );   
    axios.post("http://localhost:8080/Cleaner/create",
      {   Status:user.Status,
        RefId: user._id, 
        dayInWork: values,},
      { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
            sendEmail({to: user.Email,
                       subject: `claps ${user.FirstName} ${user.LastName}`,
                       text: `you finished your signUp come ang enjoy here http://localhost:5173, we are waiting for you your data is : ${user}`,
  })
      console.log('', res.data);
    })
    .catch((err) => {
      console.error(err);
    });   
  }
  const handleModalClose = () => { // פונקציה לסגירת המודל ועדכון הסטייט באב
    setVisible(false);
    onClose(); // קריאה לפונקציה שהועברה מהקומפוננטה האב
  };
  return (
    <Modal
      title="בחירת ימי עבודה למנקה"
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ dayInWork: [] }}
      >
        <Form.Item
          label="בחר את ימי העבודה בשבוע"
          name="dayInWork"
          rules={[{ required: true, message: "חובה לבחור לפחות יום אחד" }]}
        >
<Spin spinning={loadingDayInWeek}>
  <Select
    mode="multiple"
    placeholder="בחר ימים"
    allowClear
    onChange={(values) => {
      console.log("ערכים שנבחרו ב-Select:", values);
      form.setFieldsValue({ dayInWork: values }); // עדכון ערכי הטופס
    }}
  >
    {dayInWork &&
      Object.values(dayInWork).map((value) => (
        <Option key={value} value={value}>
          {value}
        </Option>
      ))}
  </Select>
</Spin>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            שמור
          </Button>
        </Form.Item>
      </Form>
    </Modal>
   
  );
};

export default CleanerDaysModal;
