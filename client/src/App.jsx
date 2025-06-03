import { lazy } from 'react';
import './App.css'
import ApartmentDetails from './Components/Apartment/ApartmentDetails';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';

const SingUp = lazy(() => import('./Components/Navbar/SignUp'));
const SingIn = lazy(() => import('./Components/Navbar/SignIn'));
const Home = lazy(() => import('./Components/Home'));
const ManagerPage = lazy(() => import('./Components/Manager/ManagerPage'));
const ActivitiesList = lazy(() => import('./Components/Activity/ActivitiesList'));
const FinalSignUpButton= lazy(() => import('./Components/FinalSignUpButton'));
const Profile= lazy(() => import('./Components/Navbar/Profile'));
const HomeCleaner= lazy(() => import('./Components/Cleaner/Home'));
const FinalSignUpCleaner= lazy(() => import('./Components/Cleaner/FinalSingUp'));
const HomeElderly= lazy(() => import('./Components/Elderly/Home'));
const FinalSignUpElderly= lazy(() => import('./Components/Elderly/FinalSingUp'));
const FinalSignUpManager= lazy(() => import('./Components/Manager/FinalSingUp'));
const ChooseAppButton= lazy(() => import('./Components/Apartment/ChooseAppButton'));
const SeeApartments = lazy(() => import('./Components/Apartment/ApartmentList'));
const DaysOfCleaning = lazy(() => import('./Components/Elderly/DaysOfCleaning'));
function App() {
  return (
    <>
      <Navbar />
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Profile/:_id" element={<Profile />}/>
        <Route path="/Elderly/DaysOfCleaning" element={<DaysOfCleaning/>}/>
        <Route path="/SeeApartments" element={<SeeApartments />}/>
        <Route path="/SignUp" element={<SingUp />}/>
        <Route path="/SignIn" element={<SingIn />}/>
        <Route path="/ActivitiesList" element={<ActivitiesList />}/>
        <Route path="/ManagerPage" element={<ManagerPage />}/>
        <Route path="/FinalSignUpButton" element={<FinalSignUpButton />}/>
        <Route path="/FinalSignUpButton/elderly" element={<FinalSignUpElderly />}/>
        <Route path="/FinalSignUpButton/cleaner" element={<FinalSignUpCleaner />}/>
        <Route path="/FinalSignUpButton/manager" element={<FinalSignUpManager />}/>
        <Route path="/apartments/:apartmentId" element={<ApartmentDetails />} />
        <Route path="/ChooseAppButton" element={<ChooseAppButton />} />
        <Route path="/HomeCleaner" element={<HomeCleaner />}/>
        <Route path="/HomeElderly" element={<HomeElderly />}/>
      </Routes>
    </>
  )
}

export default App
