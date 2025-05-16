import { lazy } from 'react';
import './App.css'
import ApartmentDetails from './Components/Elderly/Apartment/ApartmentDetails';

import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
const SingUp = lazy(() => import('./Components/SignUp'));
const SingIn = lazy(() => import('./Components/SignIn'));
const Home = lazy(() => import('./Components/Home'));
const GetQueueByRole = lazy(() => import('./Components/Manager/GetQueueByRole'));
const QueueTable = lazy(() => import('./Components/Manager/QueueTable'));
const ManagerPage = lazy(() => import('./Components/Manager/ManagerPage'));
const ActivitiesList = lazy(() => import('./Components/Elderly/Activity/ActivitiesList'));
const ElderlyCalender = lazy(() => import('./Components/Elderly/ElderlyCalender'));
const AploadPicture = lazy(() => import('./Components/AploadPicture'));
const AddActivity = lazy(() => import('./Components/Manager/AddActivity'));
const FinalSignUpButton= lazy(() => import('./Components/FinalSignUpButton'));
const Profile= lazy(() => import('./Components/Profile'));

const HomeCleaner= lazy(() => import('./Components/Cleaner/Home'));
const FinalSignUpCleaner= lazy(() => import('./Components/Cleaner/FinalSingUp'));
const HomeElderly= lazy(() => import('./Components/Elderly/Home'));
const FinalSignUpElderly= lazy(() => import('./Components/Elderly/FinalSingUp'));
const HomeManager= lazy(() => import('./Components/Manager/Home'));
const FinalSignUpManager= lazy(() => import('./Components/Manager/FinalSingUp'));
const ChooseAppButton= lazy(() => import('./Components/Elderly/Apartment/ChooseAppButton'));
const UserTable = lazy(() => import('./Components/Manager/UserTable'));

const SeeApartments = lazy(() => import('./Components/Elderly/Apartment/ApartmentList'));
const ApartmentForm = lazy(() => import('./Components/Manager/Apartment/ApartmentForm'));
const DaysOfCleaning = lazy(() => import('./Components/Elderly/DaysOfCleaning'));
function App() {


  return (
    <>
      <Navbar />
        <Routes>
        <Route path="/" element={<DaysOfCleaning elderlyId={"68239808dade07541ded51d5"} />}/>
        <Route path="/Profile/:_id" element={<Profile />}/>
        {/* בהרשמת זקן לתת לו אפשרות לבחור בחלון קופץ צדדי וגם בפרפיל */}
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
        <Route path="/HomeManager" element={<HomeManager />}/>
        
      </Routes>
    </>
  )
}

export default App
