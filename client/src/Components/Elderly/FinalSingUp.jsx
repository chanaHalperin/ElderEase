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
import { sendEmail } from '../../SendEmail';
import '../../styles/Elderly/ElderlyFinalSingUp.css';
import ApartmentSelectModal from "../Apartment/ApartmentSelectModal"; // תיצור קומפוננטה כזו
const { Option } = Select;

const ElderRegistrationModal = ({ onClose }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();
  const [apartmentModalOpen, setApartmentModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const {
    data: genderOptions,
    loading: loadingGender,
  } = useEnum("getGender");

  const {
    data: personalStatusOptions,
    loading: loadingPersonalStatus,
  } = useEnum("getPersonalStatus");

  const {
    data: userStatus,
  } = useEnum("getUserStatus");

  const onFinish = async (values) => {
    try {
      await createElderlyFinal(values);
      dispatch(setUser({ Status: userStatus.ACTIVE }));
      onClose();
    } catch (error) {
      //לשנות את ההודעה לנוטיפיקשיין
      alert("אנא נסה שנית שגיאה בהזנת נתונים");
    }
  };

  const user = useSelector((state) => state.user);

  async function createElderlyFinal(values) {
    axios.post(`http://localhost:8080/Elderly/create` ,
      { Status: user.Status, RefId: user._id, ...values },
      { withCredentials: true   }
    )
      .then((res) => {
        sendEmail({
          to: user.Email,
          subject: `claps ${user.FirstName} ${user.LastName}`,
          text: `you finished your signUp come ang enjoy here http://localhost:5173, we are waiting for you your data is : ${user}`,
        })
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleModalClose = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      title="טופס רישום זקן"
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      width={600}
      bodyStyle={{ background: "#f9fbfd", borderRadius: 18 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="elder-modal-form">
        <Form.Item label="מגדר" name="Gender" rules={[{ required: true, message: "נא לבחור מגדר" }]}>
          <Spin spinning={loadingGender}>
            <Select
              placeholder="בחר מגדר"
              onChange={(value) => form.setFieldsValue({ Gender: value })}
            >
              {genderOptions && Object.values(genderOptions).map((value) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Spin>
        </Form.Item>
        <Form.Item
          label="מצב אישי"
          name="PersonalStatus"
          rules={[{ required: true, message: "נא לבחור מצב אישי" }]}
        >
          <Spin spinning={loadingPersonalStatus}>
            <Select
              placeholder="בחר מצב אישי"
              onChange={(value) => form.setFieldsValue({ PersonalStatus: value })}
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
        <Form.Item
          label="בחר דירה"
          name="ApartmentId"
          rules={[{ required: true, message: "נא לבחור דירה" }]}
        >
          <Button type="primary" onClick={() => setApartmentModalOpen(true)}>
            פתח רשימת דירות פנויות
          </Button>
          {selectedApartment && (
            <div style={{ marginTop: 8, color: "#1890ff" }}>
              דירה שנבחרה: {selectedApartment}
            </div>
          )}
          <ApartmentSelectModal
            open={apartmentModalOpen}
            userId={user._id}
            onSelect={apartmentId => {
              setSelectedApartment(apartmentId);
              form.setFieldsValue({ ApartmentId: apartmentId });
              setApartmentModalOpen(false);
            }}
            onCancel={() => setApartmentModalOpen(false)}
          />
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