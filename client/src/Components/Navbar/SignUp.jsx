import React from 'react';
import axios from 'axios';
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Select, Button, Typography, Card, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Store/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useEnum } from "../../Enums/useEnum";
import { sendEmail } from '../../SendEmail';
import CreateToken from "../../CreateToken";
import "../../styles/SignUp.css";

const { Title } = Typography;

const SignUp = () => {
  const { data: roles, loading, error } = useEnum("getRolesWithOutManager");
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`http://localhost:8080/User/create`, data, { withCredentials: true });
      sendEmail({
        to: response.data.Email,
        subject: "Welcome to our system",
        text: `hello ${response.data.FirstName} ${response.data.LastName} , you logged insuccessfully`
      });
      dispatch(setUser(response.data));
      CreateToken({ Id: res.data.Id, Role: res.data.Role });
      navigate("/");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
        if (status === 400 && message.includes("duplicate")) {
          if (message.includes("Id")) alert("The Id you entered must be unique. Please try again.");
          if (message.includes("Email")) alert("The Email you entered must be unique. Please try again.");
          if (message.includes("Password")) alert("The Password you entered must be unique. Please try again.");
          alert("The field you entered must be unique. Please try again.");
        } else if (status === 400) {
          alert("Bad request. Please check your input.");
        } else if (status === 500) {
          alert("Server error. Please try again later.");
        } else 
          alert(`Unexpected error: ${message}`);
      }
    }
  };

  return (
    <div className="signup-bg">
      <Card className="signup-card" bordered={false}>
        <Title level={2} className="signup-title">הרשמה למערכת</Title>
        {loading && <p>טוען סטטוסים...</p>}
        {error && <p>שגיאה בטעינת סטטוסים</p>}
        {!loading && !error && (
          <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="שם פרטי"
                  validateStatus={errors.FirstName ? "error" : ""}
                  help={errors.FirstName?.message}
                >
                  <Controller
                    name="FirstName"
                    control={control}
                    rules={{
                      required: "First name is required",
                      minLength: { value: 2, message: "לפחות 2 תווים" },
                      maxLength: { value: 50, message: "עד 50 תווים" }
                    }}
                    render={({ field }) => <Input {...field} placeholder="שם פרטי" size="large" />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="שם משפחה"
                  validateStatus={errors.LastName ? "error" : ""}
                  help={errors.LastName?.message}
                >
                  <Controller
                    name="LastName"
                    control={control}
                    rules={{
                      required: "Last name is required",
                      minLength: { value: 2, message: "לפחות 2 תווים" },
                      maxLength: { value: 50, message: "עד 50 תווים" }
                    }}
                    render={({ field }) => <Input {...field} placeholder="שם משפחה" size="large" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="תעודת זהות"
                  validateStatus={errors.Id ? "error" : ""}
                  help={errors.Id?.message}
                >
                  <Controller
                    name="Id"
                    control={control}
                    rules={{
                      required: "Id is required",
                      pattern: {
                        value: /^\d{9}$/,
                        message: "Id must be exactly 9 digits"
                      }
                    }}
                    render={({ field }) => <Input {...field} placeholder="תעודת זהות" size="large" />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="טלפון"
                  validateStatus={errors.Phone ? "error" : ""}
                  help={errors.Phone?.message}
                >
                  <Controller
                    name="Phone"
                    control={control}
                    rules={{
                      required: "Phone is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "מספר טלפון לא תקין"
                      }
                    }}
                    render={({ field }) => <Input {...field} placeholder="טלפון" size="large" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="אימייל"
                  validateStatus={errors.Email ? "error" : ""}
                  help={errors.Email?.message}
                >
                  <Controller
                    name="Email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email format"
                      }
                    }}
                    render={({ field }) => <Input {...field} placeholder="אימייל" size="large" />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="אימות אימייל"
                  validateStatus={errors.confirmEmail ? "error" : ""}
                  help={errors.confirmEmail?.message}
                >
                  <Controller
                    name="confirmEmail"
                    control={control}
                    rules={{
                      required: "Confirm email is required",
                      validate: (value) =>
                        value === watch("Email") || "Emails do not match"
                    }}
                    render={({ field }) => <Input {...field} placeholder="אימות אימייל" size="large" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="סיסמה"
                  validateStatus={errors.Password ? "error" : ""}
                  help={errors.Password?.message}
                >
                  <Controller
                    name="Password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,12}$/,
                        message: "סיסמה בין 8-12 תווים, אות גדולה, קטנה ומספר"
                      }
                    }}
                    render={({ field }) => <Input.Password {...field} placeholder="סיסמה" size="large" />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="אימות סיסמה"
                  validateStatus={errors.confirmPassword ? "error" : ""}
                  help={errors.confirmPassword?.message}
                >
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === watch("Password") || "Passwords do not match"
                    }}
                    render={({ field }) => <Input.Password {...field} placeholder="אימות סיסמה" size="large" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="תפקיד"
              validateStatus={errors.Role ? "error" : ""}
              help={errors.Role?.message}
            >
              <Controller
                name="Role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select {...field} placeholder="בחר תפקיד" size="large">
                    {roles.map((role) => (
                      <Select.Option key={role} value={role}>
                        {role}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                הרשמה
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default SignUp;