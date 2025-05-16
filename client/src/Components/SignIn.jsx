import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/UserSlice';
import { useEnum } from "../Enums/useEnum";

const SignIn = () => {
  const { data: UserStatus } = useEnum("getUserStatus");
  const { data: UserRole } = useEnum("getRoles");
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
    console.log("Success:", data);
    axios.post(`http://localhost:8080/User/getByIdNumber`, {
      Id: data.idNumber,
      password: data.password,
    }).then(res => {
      console.log('User login successfully:', res.data);
      dispatch(setUser(res.data));
      // localStorage.setItem("user", JSON.stringify(res.data));
     switch (res.data.Status) {
        case UserStatus.ACTIVE:
          RoleSwitch(res.data.Role);
          break;
        // case UserStatus.CONFIRMED:
        //   navigate("/FinalSignUpButton", { state: { role: res.data.Role } });
        //   break;
        default:
          navigate("/");
      }
    }).catch(err => {
      console.error(err);
      navigate("/SignUp");
    });
  };

  const RoleSwitch = (role) => {
    switch (role) {
      case UserRole.RELATIVE:
        navigate("/Home");
        break;
      case UserRole.CLEANER:
        navigate("/HomeCleaner");
        break;
      case UserRole.ELDERLY:
        navigate("/HomeElderly");
        break;
      default:
        navigate("/HomeManager");
    }
  };

  return (
    <Form
      name="login"
      style={{ maxWidth: 360, margin: 'auto', marginTop: '100px' }}
      onFinish={handleSubmit(onSubmit)}
    >
      <Form.Item
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
              placeholder="ID Number"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        validateStatus={errors.password && 'error'}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            pattern: {/*(?=.*[A-Z])*/
              value: /^(?=.*[a-z])(?=.*\d).{8,12}$/,
              message: "Must include bwteen 8-12: upercase, lowcase ,and number",
            },
          }}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Password"
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
              <Checkbox {...field} checked={field.value}>Remember me</Checkbox>
            )}
          />
          <a href="#">Forgot password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Log in
        </Button>
        or <a href="#">Register now!</a>
      </Form.Item>
    </Form>
  );
};

export default SignIn;
