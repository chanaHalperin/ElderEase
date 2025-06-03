
const {DayInWeek,Gender,PersonalStatus,ActivityCategory,Roles,UserStatus,ApartmentStatus} = require('../Constants/enums');

function getDayInWeek(req, res) {
    res.status(200).send(DayInWeek);
}
function getGender(req, res) {
    res.status(200).send(Gender);
}
function getPersonalStatus(req, res) {
    res.status(200).send(PersonalStatus);
}
function getActivityCategory(req, res) {
    res.status(200).send(ActivityCategory);
}
function getRoles(req, res) {
    res.status(200).send(Roles);
}
function getRolesWithOutManager(req, res) {
    const filteredRoles = Object.values(Roles).filter(role => role != Roles.ADMIN); // סינון הערך של ADMIN
    res.status(200).send(filteredRoles); 
}
function getUserStatus(req, res) {
    res.status(200).send(UserStatus);
}
function getApartmentStatus(req, res) {
    res.status(200).send(ApartmentStatus);
}

module.exports = {
    getDayInWeek,
    getGender,
    getPersonalStatus,
    getActivityCategory,
    getRoles,
    getRolesWithOutManager,
    getUserStatus,
    getApartmentStatus
};