import { useSelector } from "react-redux";
import { Layout } from "antd";
import { lazy } from "react";
const FinalSignUpButton= lazy(() => import('./FinalSignUpButton'));
const JoinCommunity_button= lazy(() => import('./JoinCommunity_button'));
const { Header, Content } = Layout;

const Home = () => {
const user =  useSelector((state) => state.user);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: 0,
          background: "#001529", // צבע רקע ברירת מחדל של ant
        }}
      >
      </Header>
      <Content style={{ padding: 24 }}>
        ברוך הבא, {user.FirstName}
        <br/>
        <br/>
        {user.Status==="guest"&&
        <JoinCommunity_button/>}
        
        {user.Status==="pending"&&
        <p>מחכה לאישור קבלה מהמנהל</p>}

        {user.Status==="confirmed"&&
        <p>אתה מאושר על ידי המנהל , אנא אשלם את הרישום</p>&&
        <br/>&&
        <FinalSignUpButton  role={user.Role } />
        }
      </Content>
    </Layout>
  );
};

export default Home;
