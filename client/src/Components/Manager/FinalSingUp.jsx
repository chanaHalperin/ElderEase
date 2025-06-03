import React, { useState } from 'react';
import { Form, Checkbox, Button, Typography, Card, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setUser } from "../../Store/UserSlice";
import axios from 'axios';
import { sendEmail } from '../../SendEmail';

const { Title, Paragraph } = Typography;

const FinalManagerSignUp = ({ onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [agreed, setAgreed] = useState(false);
  const {
    data: userStatus,
    loading: loadinguserStatus,
    error: erroruserStatus,
  } = useEnum("getUserStatus");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true); // טופס נפתח אוטומטית
  const onFinish = () => {
    createManagerFinal()
    message.success("נרשמת בהצלחה כמנהל!");
    navigate("/HomeManager");
  };
  const user = useSelector((state) => state.user);
  async function createManagerFinal() {
    try {
      const res = await axios.post(
        `http://localhost:8080/Manager/create`,
        { Status: user.Status, RefId: user._id }, { withCredentials: true },
        { headers: { 'Content-Type': 'application/json' } }
      );
      sendEmail({
        to: user.Email,
        subject: `claps ${user.FirstName} ${user.LastName}`,
        text: `you finished your signUp come ang enjoy here http://localhost:5173, we are waiting for you your data is : ${user}`,
      })
      message.success("נרשמת בהצלחה כמנהל!");
      dispatch(setUser({ Status: userStatus.ACTIVE }));
      navigate("/HomeManager");
    } catch (err) {
      message.error("אירעה שגיאה בעת הרישום. אנא נסה שוב.");
    }
  }
  const handleModalClose = () => { // פונקציה לסגירת המודל ועדכון הסטייט באב
    setVisible(false);
    onClose(); // קריאה לפונקציה שהועברה מהקומפוננטה האב
  };
  return (
    <Modal
      title="טופס רישום מנהל"
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      width={600}
    >
      <div style={{ maxWidth: 600, margin: '50px auto' }}>
        <Card bordered>
          <Typography>
            <Title level={3}>ברוך הבא למערכת</Title>
            <Paragraph>
              לפני שנמשיך, עליך לקרוא ולאשר את תנאי השימוש והתקנון.
            </Paragraph>
            <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #d9d9d9', padding: 15, marginBottom: 20 }}>
              <Paragraph>
                <strong>תקנון שימוש במערכת:</strong><br /><br />
                1. המשתמש מתחייב להשתמש במערכת בהתאם להוראות החוק ולשמירה על פרטיות הדיירים.<br />
                2. אין להעביר מידע אישי לצד ג' ללא אישור מראש.<br />
                3. כל פעולה שתתבצע במערכת תהיה תחת אחריותו של המשתמש המחובר.<br />
                4. המנהל מתחייב לא לנסות לפרוץ או לשנות את המערכת.<br />
                5. החברה רשאית לשנות את תנאי התקנון בכל עת.<br /><br />
                בחתימתך אתה מאשר את התקנון ומתחייב לפעול על פיו.
              </Paragraph>
            </div>
          </Typography>

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[{
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject("עליך לאשר את התקנון"),
              }]}
            >
              <Checkbox onChange={(e) => setAgreed(e.target.checked)}>
                אני מאשר/ת את התקנון ומסכים/ה לתנאיו
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!agreed} block>
                אני מסכים ומסיים רישום
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};

export default FinalManagerSignUp;
