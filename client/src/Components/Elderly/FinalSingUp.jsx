import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Checkbox,
  InputNumber,
  Spin,
} from "antd";
import { useEnum } from "../../Enums/useEnum";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Store/UserSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendEmail } from '../../SendEmail';
const { Option } = Select;

const ElderRegistrationModal = ({ onClose }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true); // מוצג כברירת מחדל
const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: genderOptions,
    loading: loadingGender,
    error: errorGender,
  } = useEnum("getGender");
  console.log(genderOptions);

  const {
    data: personalStatusOptions,
    loading: loadingPersonalStatus,
    error: errorPersonalStatus,
  } = useEnum("getPersonalStatus");
   const {
    data: userStatus,
    loading: loadinguserStatus,
    error: erroruserStatus,
  } = useEnum("getUserStatus");

  const onFinish =async (values) => {
    console.log("Submitted:", values);
    try{
    await createElderlyFinal(values);
    //jhvodwbbdkebvp
 dispatch(setUser({ Status: userStatus.ACTIVE }));
        //האם לנווט פה?       
        navigate("/HomeElderly");
    onClose();}
    catch (error) {
      console.error("Error creating elderly:", error);
      alert("אנא נסה שנית שגיאה בהזנת נתונים");
    }
  };
const user =  useSelector((state) => state.user);
  async function createElderlyFinal(values) {
    axios.post(`http://localhost:8080/Elderly/create`,
      {   Status:user.Status,
        RefId: user._id, 
        ...values,},
      { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      console.log('', res.data);
      sendEmail({to: user.Email,
                       subject: `claps ${user.FirstName} ${user.LastName}`,
                       text: `you finished your signUp come ang enjoy here http://localhost:5173, we are waiting for you your data is : ${user}`,
  })
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
      title="טופס רישום זקן"
      open={visible}
      onCancel={handleModalClose}
      onFinish={onFinish}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="שם מלא"
          name="FullName"
          rules={[{ required: true, message: "נא להזין שם מלא" }]}
        >
          <Input placeholder="לדוגמה: ישראל ישראלי" />
        </Form.Item>

        {/* <Form.Item
          label="מגדר"
          name="Gender"
          rules={[{ required: true, message: "נא לבחור מגדר" }]}
        >
          <Spin spinning={genderOptions}>
            <Select placeholder="בחר מגדר">
              {genderOptions?.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Spin>
        </Form.Item> */}
               {/* <Form.Item
          label="מגדר"
          name="Gender"
          rules={[{ required: true, message: "נא לבחור מגדר" }]}
        >
          <Spin spinning={loadingGender}>
            <Select placeholder="בחר מגדר">
              {genderOptions && Object.values(genderOptions).map((value) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Spin>
        </Form.Item> */}
<Form.Item label="מגדר" name="Gender" rules={[{ required: true, message: "נא לבחור מגדר" }]}>
    <Spin spinning={loadingGender}>
        <Select
            placeholder="בחר מגדר"
            onChange={(value) => form.setFieldsValue({ Gender: value })} // <-- הוסף את זה
        >
            {genderOptions && Object.values(genderOptions).map((value) => (
                <Option key={value} value={value}>
                    {value}
                </Option>
            ))}
        </Select>
    </Spin>
</Form.Item>
        {/* <Form.Item
          label="מצב משפחתי"
          name="PersonalStatus"
          rules={[{ required: true, message: "נא לבחור מצב משפחתי" }]}
        >
          <Spin spinning={loadingPersonalStatus}>
            <Select placeholder="בחר מצב משפחתי">
              {personalStatusOptions?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Spin>
        </Form.Item> */}
        {/* <Form.Item
          label="מצב אישי"
          name="personalStatus"
          rules={[{ required: true, message: "נא לבחור מצב אישי" }]}
        >
          <Spin spinning={loadingPersonalStatus}>
            <Select placeholder="בחר מצב אישי">
              {personalStatusOptions && Object.values(personalStatusOptions).map((value) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Spin>
        </Form.Item> */}
<Form.Item label="מצב אישי" name="personalStatus" rules={[{ required: true, message: "נא לבחור מצב אישי" }]}>
    <Spin spinning={loadingPersonalStatus}>
        <Select
            placeholder="בחר מצב אישי"
            onChange={(value) => form.setFieldsValue({ personalStatus: value })} // <-- הוסף את זה
        >
            {personalStatusOptions && Object.values(personalStatusOptions).map((value) => (
                <Option key={value} value={value}>
                    {value}
                </Option>
            ))}
        </Select>
    </Spin>
</Form.Item>
        <Form.Item
          label="תאריך לידה"
          name="DateOfBirth"
          rules={[{ required: true, message: "נא להזין תאריך לידה" }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="טלפון קרוב משפחה"
          name="RelativePhone"
          rules={[
            { required: true, message: "נא להזין מספר טלפון" },
            { pattern: /^0\d{1,2}-?\d{7}$/, message: "מספר טלפון לא תקין" },
          ]}
        >
          <Input placeholder="לדוגמה: 050-1234567" />
        </Form.Item>

        <Form.Item
          label="מספר תיק רפואי"
          name="MedicalBag"
          rules={[
            { required: true, message: "נא להזין מספר תיק רפואי" },
            { type: "number", min: 1, message: "המספר חייב להיות חיובי" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="מזהה דירה (אם יש)" name="ApartmentId">
          <Input placeholder="ObjectId או מזהה פנימי" />
        </Form.Item>

        <Form.Item
          name="HasPhilipin"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                typeof value === "boolean"
                  ? Promise.resolve()
                  : Promise.reject("חובה לסמן אם יש מטפל פיליפיני"),
            },
          ]}
        >
          <Checkbox>יש מטפל פיליפיני</Checkbox>
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

export default ElderRegistrationModal;
