import { useNavigate } from 'react-router-dom';
const Home = () => {
const navigate = useNavigate();
    return (
      <>
      <div className="home manager">
        <h1>Welcome to the Home Page</h1>
        <p>This is the manager home page of the application.</p>
        <p>Here you can manage the application and its users.</p>
        <p>
          <button onClick={() =>navigate('/ManagerPage')}>Go to Manager Page</button>
          
        </p>
      </div>
      </>
    );
  }
  export default Home;