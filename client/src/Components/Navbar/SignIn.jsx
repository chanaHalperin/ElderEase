import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, Typography, Card } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Store/UserSlice';
import "../../styles/SignIn.css";
import CreateToken from "../../CreateToken"


const { Title } = Typography;

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idNumber: '',
      password: '',
      remember: true,
    },
  });

  const onSubmit = (data) => {
    axios.post(`http://localhost:8080/User/getByIdNumber`, {
      Id: data.idNumber,
      password: data.password,
    }).then(res => {
      dispatch(setUser(res.data));
      CreateToken({ Id: res.data.Id, Role: res.data.Role });
      navigate("/");
    }).catch(err => {
      navigate("/SignUp");
    });
  };

  return (
    <div className="signin-bg">
      <Card className="signin-card" bordered={false}>
        <Title level={2} className="signin-title">התחברות למערכת</Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
        >
          <Form.Item
            label="תעודת זהות"
            validateStatus={errors.idNumber && 'error'}
            help={errors.idNumber?.message}
          >
            <Controller
              name="idNumber"
              control={control}
              rules={{
                required: "ID number is required",
                pattern: {
                  value: /^\d{9}$/,
                  message: "ID number must be exactly 9 digits",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="הכנס תעודת זהות"
                  size="large"
                  autoComplete="username"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="סיסמה"
            validateStatus={errors.password && 'error'}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*\d).{8,12}$/,
                  message: "סיסמה בין 8-12 תווים, אותיות ומספרים",
                },
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="הכנס סיסמה"
                  size="large"
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>זכור אותי</Checkbox>
                )}
              />
              <a href="#" className="signin-link">שכחת סיסמה?</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              התחבר
            </Button>
            <div className="signin-register">
              עדיין אין לך חשבון? <NavLink to="/SignUp">הרשם עכשיו</NavLink>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;