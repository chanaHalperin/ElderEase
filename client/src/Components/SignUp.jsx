
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Select, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useEnum } from "../Enums/useEnum";
import { sendEmail } from '../SendEmail';
const { Option } = Select;


const SingUp = () => {
  const { data: roles, loading, error } = useEnum("getRolesWithOutManager");
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();





  const onSubmit = async (data) => {
    console.log('Received values of form: ', data);
    try {
      const response = await axios.post(`http://localhost:8080/User/create`, data);
      console.log('User created successfully:', response.data);
      sendEmail({
        to: response.data.Email,
        subject: "Welcome to our system",
        text: `hello ${response.data.FirstName} ${response.data.LastName} , you logged in successfully`
      });
      dispatch(setUser(response.data));
      navigate("/ActivitiesList");
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response) {
        // השגיאה הגיעה מהשרת
        const status = error.response.status; // קוד הסטטוס
        const message = error.response.data.message; // הודעת השגיאה מהשרת

        if (status === 400 && message.includes("duplicate")) {
          if (message.includes("Id")) {
            alert("The Id you entered must be unique. Please try again.");
          }
          if (message.includes("Email")) {
            alert("The Email you entered must be unique. Please try again.");
          }
          if (message.includes("Password")) {
            alert("The Password you entered must be unique. Please try again.");
          }
          alert("The field you entered must be unique. Please try again.");
        } else if (status === 400) {
          alert("Bad request. Please check your input.");
        } else if (status === 500) {
          alert("Server error. Please try again later.");
        } else {
          alert(`Unexpected error: ${message}`);
        }
      }
    }
  };

  return (
    <>
      {loading && <p>טוען סטטוסים...</p>}
      {error && <p>שגיאה בטעינת סטטוסים</p>}
      {!loading && !error && (
        <Form
          onFinish={handleSubmit(onSubmit)}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          {/* Id */}
          <Form.Item
            label="Id"
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
              render={({ field }) => <Input {...field} placeholder="Input Id" />}
            />
          </Form.Item>

          {/* First Name */}
          <Form.Item
            label="First Name"
            validateStatus={errors.FirstName ? "error" : ""}
            help={errors.FirstName?.message}
          >
            <Controller
              name="FirstName"
              control={control}
              rules={{
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters"
                },
                maxLength: {
                  value: 50,
                  message: "First name must be at most 50 characters"
                }
              }}
              render={({ field }) => <Input {...field} placeholder="Input first name" />}
            />
          </Form.Item>

          {/* Last Name */}
          <Form.Item
            label="Last Name"
            validateStatus={errors.LastName ? "error" : ""}
            help={errors.LastName?.message}
          >
            <Controller
              name="LastName"
              control={control}
              rules={{
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters"
                },
                maxLength: {
                  value: 50,
                  message: "Last name must be at most 50 characters"
                }
              }}
              render={({ field }) => <Input {...field} placeholder="Input last name" />}
            />
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" style={{ marginBottom: 0 }}>
            <Form.Item
              validateStatus={errors.Email ? "error" : ""}
              help={errors.Email?.message}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
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
                render={({ field }) => <Input {...field} placeholder="Input email" />}
              />
            </Form.Item>
            <Form.Item
              validateStatus={errors.confirmEmail ? "error" : ""}
              help={errors.confirmEmail?.message}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '8px' }}
            >
              <Controller
                name="confirmEmail"
                control={control}
                rules={{
                  required: "Confirm email is required",
                  validate: (value) =>
                    value === watch("Email") || "Emails do not match"
                }}
                render={({ field }) => <Input {...field} placeholder="Confirm email" />}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Role"
            validateStatus={errors.Role ? "error" : ""}
            help={errors.Role?.message}
          >
            <Controller
              name="Role"
              control={control}
              rules={{
                required: "Role is required"
              }}
              render={({ field }) => (
                <Select {...field} placeholder="Select role">
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
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
                  message: "Must include bwteen 8-12: upercase, lowcase ,and number",
                }
              }}
              render={({ field }) => <Input.Password {...field} placeholder="Input password" />}
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Confirm Password"
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
              render={({ field }) => <Input.Password {...field} placeholder="Confirm password" />}
            />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            label="Phone"
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
                  message: "Invalid phone number format"
                }
              }}
              render={({ field }) => <Input {...field} placeholder="Input phone number" />}
            />
          </Form.Item>

          {/* Submit */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default SingUp; { } { } { }