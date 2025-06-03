import React, { lazy } from "react";
import { Menu, Avatar, Typography, Dropdown, Space } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEnum } from "../../Enums/useEnum";
import {
  UserOutlined,
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import "../../styles/Navbar.css";
import JoinCommunity_button from "../JoinCommunity_button";
import FinalSignUp from "../FinalSignUpButton";
import logo from "../../../public/logo4.png";

const LogOut = lazy(() => import('./LogOut'));
const Navbar = () => {
  const user = useSelector((state) => state.user);
  const { FirstName, LastName, _id, Status, Role } = user || {};
  const initials = `${FirstName?.[0] || ""}${LastName?.[0] || ""}`;
  const { data: UserStatus } = useEnum("getUserStatus");
  const { data: UserRole } = useEnum("getRoles");
  const getHomePathByRole = (role) => {
    switch (role) {
      case UserRole.RELATIVE:
        return "/Home";
      case UserRole.CLEANER:
        return "/HomeCleaner";
      case UserRole.ELDERLY:
        return "/HomeElderly";
      default:
        return "/ManagerPage";
    }
  };
  // תפריט למשתמש לא מחובר
  const guestMenu = (
    <>
      <Menu.Item key="signin" icon={<LoginOutlined />}>
        <NavLink to="/SignIn">התחברות</NavLink>
      </Menu.Item>
      <Menu.Item key="signup" icon={<UserAddOutlined />}>
        <NavLink to="/SignUp">הרשמה</NavLink>
      </Menu.Item>
    </>
  );

  // תפריט למשתמש מחובר (dropdown)
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to={`/Profile/${_id}`}>פרופיל</NavLink>
      </Menu.Item>
      <Menu.Item key="logout">
        <LogOut />
      </Menu.Item>
    </Menu>
  );

  // תפריט פרופיל מוצג תמיד למשתמש מחובר
  const profileDropdown = user && _id && (
    <Menu.Item key="profile-dropdown" style={{ float: "left" }}>
      <Dropdown overlay={userMenu} placement="bottomRight" arrow>
        <Space>
          <Avatar className="navbar-avatar" style={{ backgroundColor: "#40a9ff" }} icon={!initials && <UserOutlined />}>
            {initials}
          </Avatar>
          <Typography.Text className="navbar-username">
            {FirstName} {LastName}
          </Typography.Text>
        </Space>
      </Dropdown>
    </Menu.Item>
  );

  // לוגיקה להצגת כפתור/הודעה לפי סטטוס
  const renderUserSection = () => {
    if (!user || !Status) {
      // לא מחובר בכלל
      return guestMenu;
    }
    if (!UserStatus) {
      // עדיין טוען enums
      return <Menu.Item disabled>טוען...</Menu.Item>;
    }

    switch (Status) {
      case UserStatus.GUEST:
        return (
          <>
            <Menu.Item key="join">
              <JoinCommunity_button />
            </Menu.Item>
            {profileDropdown}
          </>
        );
      case UserStatus.PENDING:
        return (
          <>
            <Menu.Item key="pending" disabled>
              <span>הבקשה שלך ממתינה לאישור מנהל</span>
            </Menu.Item>
            {profileDropdown}
          </>
        );
      case UserStatus.CONFIRMED:
        return (
          <>
            <Menu.Item key="final-signup">
              <FinalSignUp role={Role} />
            </Menu.Item>
            {profileDropdown}
          </>
        );
      case UserStatus.REJECTED:
        return (
          <>
            <Menu.Item key="rejected" disabled>
              <span>הבקשה נדחתה</span>
            </Menu.Item>
            {profileDropdown}
          </>
        );
      case UserStatus.INACTIVE:
        return (
          <>
            <Menu.Item key="inactive" disabled>
              <span>החשבון שלך אינו פעיל</span>
            </Menu.Item>
            {profileDropdown}
          </>
        );
      case UserStatus.ACTIVE:
        return (
          <>
            <Menu.Item key="home-user" icon={<HomeOutlined />}>
              <NavLink to={getHomePathByRole(Role)}>הדף שלי</NavLink>
            </Menu.Item>
            {profileDropdown}
          </>
        );
      default:
        return profileDropdown;
    }
  };

  return (
    <nav className="navbar-container">
        <img
        src={logo}
        alt="לוגו"
        style={{
          height: 50,
          marginLeft: 24,
          verticalAlign: "middle",
          float: "right",
         // background: "#fff",
          borderRadius: 8,
          padding: 4,
          marginRight: 16,
        }}
      />
      <Menu mode="horizontal" theme="dark" className="navbar-menu">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <NavLink to="/">בית</NavLink>
        </Menu.Item>
        <Menu.Item key="SeeApartments" icon={<UserAddOutlined />}>
          <NavLink to="/SeeApartments">כל הדירות</NavLink>
        </Menu.Item>
        <Menu.Item key="all-activities" icon={<HeartOutlined />}>
          <NavLink to="/ActivitiesList">כל התוכניות</NavLink>
        </Menu.Item>
        {renderUserSection()}
      </Menu>
    </nav>
  );
};

export default Navbar;