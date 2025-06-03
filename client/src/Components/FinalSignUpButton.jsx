
import React, { useState } from 'react';
import ElderRegistrationForm from './Elderly/FinalSingUp';
import ManagerRegistrationForm from './Manager/FinalSingUp';
import CleanerRegistrationForm from './Cleaner/FinalSingUp';

const FinalSignUpButton = ({ role }) => {
  const [showForm, setShowForm] = useState(false);
  const handleFormClose = () => {
    setShowForm(false);
  };
  const renderFormByRole = () => {
    switch (role) {
      case 'elderly':
        return <ElderRegistrationForm onClose={handleFormClose} />;
      case 'cleaner':
        return <CleanerRegistrationForm onClose={handleFormClose} />;
      case 'manager':
        return <ManagerRegistrationForm onClose={handleFormClose} />;
      default:
        return <p>Role לא מזוהה</p>;
    }
  };

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Complete Sign Up</button>
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

