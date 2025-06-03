// import React, { useState, useEffect } from 'react';
// import { message } from 'antd';
// import axios from 'axios';
// import { useEnum } from "../../Enums/useEnum";
// import { useSelector } from 'react-redux';
// import DaysOfCleaningForm from './DaysOfCleaningForm';

// const DaysOfCleaning = () => {
//   const elderlyId = useSelector((state) => state.user._id);
//   const [selectedDays, setSelectedDays] = useState({});
//   const [loading, setLoading] = useState(false);

//   const {
//     data: DayInWeek,
//     loading: loadingDayInWeek,
//   } = useEnum("getDayInWeek");

//   useEffect(() => {
//     if (elderlyId) {
//       fetchCurrentCleaningDays();
//     }
//   }, [elderlyId]);

//   const fetchCurrentCleaningDays = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:8080/Elderly/getById/${elderlyId}`, { withCredentials: true });
//       const existingDays = res.data.PreferredCleaningDays || [];
//       const dayMap = {};
//       existingDays.forEach(({ day, time }) => {
//         dayMap[day] = time;
//       });
//       setSelectedDays(dayMap);
//     } catch (err) {
//       message.error('שגיאה בטעינת ימי ניקיון');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDayChange = (checkedValues) => {
//     const updated = {};
//     checkedValues.forEach((day) => {
//       updated[day] = selectedDays[day] || '08:00';
//     });
//     setSelectedDays(updated);
//   };

//   const handleTimeChange = (day, timeMoment) => {
//     const timeString = timeMoment ? timeMoment.format('HH:mm') : '08:00';
//     setSelectedDays((prev) => ({ ...prev, [day]: timeString }));
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const dataToSend = Object.entries(selectedDays).map(([day, time]) => ({
//         day,
//         time,
//       }));
//       await axios.put(
//         `http://localhost:8080/Elderly/${elderlyId}/updateCleaningDaysForElderly`,
//         { PreferredCleaningTime: dataToSend },
//         { withCredentials: true }
//       );
//       message.success('ימי הניקיון עודכנו בהצלחה');
//     } catch (err) {
//       message.error('שגיאה בעדכון ימי ניקיון');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hebrewDays = {
//     sunday: 'ראשון',
//     monday: 'שני',
//     tuesday: 'שלישי',
//     wednesday: 'רביעי',
//     thursday: 'חמישי',
//     friday: 'שישי',
//     shabos: 'שבת',
//   };

//   const dayOptions = DayInWeek
//     ? Object.values(DayInWeek).map((dayValue) => ({
//         label: hebrewDays[dayValue] || dayValue,
//         value: dayValue,
//       }))
//     : [];

//   return (
//     <DaysOfCleaningForm
//       dayOptions={dayOptions}
//       selectedDays={selectedDays}
//       onDayChange={handleDayChange}
//       onTimeChange={handleTimeChange}
//       onSave={handleSave}
//       loading={loading || loadingDayInWeek}
//       hebrewDays={hebrewDays}
//     />
//   );
// };

// export default DaysOfCleaning;