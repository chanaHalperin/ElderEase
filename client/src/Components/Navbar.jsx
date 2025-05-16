import React, { lazy } from "react";
import { Menu, Avatar, Typography, Dropdown, Space } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserOutlined,
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
const LogOut = lazy(() => import('./LogOut'));
const Navbar = () => {
  const user =  useSelector((state) => state.user);
  const { FirstName, LastName,_id }= user ? user: {};

  const initials = `${FirstName?.[0] || ""}${LastName?.[0] || ""}`;

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to={`/Profile/${_id}`}>Profile</NavLink>
      </Menu.Item>
      <Menu.Item key="logout">
      <LogOut/>
      </Menu.Item>
    </Menu>
  );

  return (
    <Menu
      mode="horizontal"
      theme="dark"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%", // זה הפתרון הקריטי
      }}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <NavLink to="/">Home</NavLink>
      </Menu.Item>
      <Menu.Item key="signin" icon={<LoginOutlined />}>
        <NavLink to="/SignIn">Sign In</NavLink>
      </Menu.Item>
      <Menu.Item key="signup" icon={<UserAddOutlined />}>
        <NavLink to="/SignUp">Sign Up</NavLink>
      </Menu.Item>

      <Menu.Item key="SeeApartments" icon={<UserAddOutlined />}>
        <NavLink to="/SeeApartments">See all apartments</NavLink>
      </Menu.Item>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          paddingRight: 16,
        }}
      >
        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
          <Space>
            <Avatar style={{ backgroundColor: "#87d068" }} icon={!initials && <UserOutlined />}>
              {initials}
            </Avatar>
            <Typography.Text style={{ color: "white" }}>
              {FirstName} {LastName}
            </Typography.Text>
          </Space>
        </Dropdown>
      </div>
    </Menu>
  );
};

export default Navbar;
