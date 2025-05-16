
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// ייבוא של הקומפוננטות המתאימות לפי הרול
import ElderRegistrationForm from './Elderly/FinalSingUp';
import ManagerRegistrationForm from './Manager/FinalSingUp';
import CleanerRegistrationForm from './Cleaner/FinalSingUp';

const FinalSignUpButton = ({role}) => {
// const role = useLocation().state?.role;
const [showForm, setShowForm] = useState(false);
const handleFormClose = () => {
  setShowForm(false);
};
  const renderFormByRole = () => {
    switch (role) {
      case 'elderly':
        return <ElderRegistrationForm onClose={handleFormClose}/>;
      case 'cleaner':
        return <CleanerRegistrationForm onClose={handleFormClose}/>;
      case 'manager':
        return <ManagerRegistrationForm onClose={handleFormClose}/>;
      default:
        return <p>Role לא מזוהה</p>;
    }
  };

  return (
    <div>
      <h1>Final Sign Up for all users</h1>
      <p>Click the button below to complete your sign-up process.</p>
      {!showForm && (
        <button onClick={()=>setShowForm(true)}>Complete Sign Up</button>
      )}
      
      {showForm && (
        <div className="form-container">
          {renderFormByRole()}
        </div>
      )}
    </div>
  );
};

export default FinalSignUpButton;

