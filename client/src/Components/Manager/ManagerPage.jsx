import React, { useState } from 'react';
import GetQueueByRole from "./GetQueueByRole";
import AddActivity from './AddActivity';
import ApartmentForm from './Apartment/ApartmentForm';
import GenericButton from '../GenericButton';
import UserTable from './UserTable';

const ManagerPage = () => {
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [showAddApartment, setShowAddApartment] = useState(false);
    const [showUsersTable, setShowUsersTable] = useState(false);

    const handleShowAddActivity = () => {
        setShowAddActivity(true);
    };
    const handleshowAddApartment = () => {
        setShowAddApartment(true);
    };
    const handleShowUsersTable = () => {
        setShowUsersTable(true);
    };
    return (
        <>
            <GetQueueByRole currentRole={"cleaner"} />
            <GetQueueByRole currentRole={"relative"} />
            <GetQueueByRole currentRole={"elderly"} />
            <GetQueueByRole currentRole={"manager"} />

            <GenericButton label="Add Activity" action={handleShowAddActivity} />

            {showAddActivity && <AddActivity />}

            <GenericButton label="Add Appartment" action={handleshowAddApartment} />

            {showAddApartment && <ApartmentForm />}
            <GenericButton label="see all users" action={handleShowUsersTable} />
            {showUsersTable && <UserTable managerId={"6812a3e31972d1b7f6fb511f"} />}
        </>
    );
};

export default ManagerPage;
