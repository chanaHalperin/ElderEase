import { lazy } from "react";
const ElderlyCalender = lazy(() => import('./ElderlyCalender'));
const Home = () => {
    return (
      <div className="home elderly">
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of the application.</p>

        <ElderlyCalender/>



      </div>
    );
  }
  export default Home;