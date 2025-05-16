const DayInWeek = Object.freeze({
    SUNDAY: 'sunday',
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
    SHABOS: 'shabos',
});

const Gender = Object.freeze({
    MALE:'male', 
    FEMALE:'female'
});

const PersonalStatus = Object.freeze({
    SINGLE:'single', 
    MARRIED:'married', 
    DIVORCED:'divorced', 
    WIDOWED:'widowed'
});

const ActivityCategory = Object.freeze({
    MUSIC:'Music', 
    SPORTS:'Sports', 
    LECTURE:'Lecture', 
    WORKSHOP:'Workshop', 
    THEATER:'Theater', 
    OTHER:'Other'
});
const Roles=Object.freeze({
    ADMIN: 'manager',
    ELDERLY: 'elderly',
    CLEANER: 'cleaner',
    RELATIVE: 'relative'
});
const UserStatus=Object.freeze({
    GUEST: 'guest',//אורח
    ACTIVE: 'active',//פעיל
    INACTIVE: 'inactive',//סיים
    PENDING: 'pending',//מחכה לאישור קבלה
    CONFIRMED: 'confirmed',//מאושר
    REJECTED: 'rejected'//נדחה
});
const ApartmentStatus=Object.freeze({
    OCCUPIED: 'occupied',//תפוס
    AVAILABLE: 'available',//פנוי
    RESERVED: 'reserved',//שמור
    UNAVAILABLE: 'unavailable'//לא זמין
});
module.exports = {DayInWeek,Gender,PersonalStatus,ActivityCategory,Roles,UserStatus,ApartmentStatus};
