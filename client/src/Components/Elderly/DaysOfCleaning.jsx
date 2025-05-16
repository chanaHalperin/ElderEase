import React, { useState, useEffect } from 'react';
import { Checkbox, Button, message, Spin, TimePicker } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEnum } from "../../Enums/useEnum";
import { useSelector } from 'react-redux';

const DaysOfCleaning = () => {
  const elderlyId=  useSelector((state) => state.user._id);
  const [selectedDays, setSelectedDays] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    data: DayInWeek,
    loading: loadingDayInWeek,
    error: errorDayInWeek,
  } = useEnum("getDayInWeek");

  useEffect(() => {
    if (elderlyId) {
      fetchCurrentCleaningDays();
    }
  }, [elderlyId]);

  const fetchCurrentCleaningDays = async () => {

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/Elderly/getById/${elderlyId}`);
      const existingDays = res.data.PreferredCleaningDays || [];
      // assume each item is { day: 'monday', time: '08:00' }
      const dayMap = {};
      existingDays.forEach(({ day, time }) => {
        dayMap[day] = time;
      });
      setSelectedDays(dayMap);
    } catch (err) {
      message.error('שגיאה בטעינת ימי ניקיון');
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (checkedValues) => {
    const updated = {};
    checkedValues.forEach((day) => {
      updated[day] = selectedDays[day] || '08:00'; // default time
    });
    setSelectedDays(updated);
  };

  const handleTimeChange = (day, timeMoment) => {
    const timeString = timeMoment ? timeMoment.format('HH:mm') : '08:00';
    setSelectedDays((prev) => ({ ...prev, [day]: timeString }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const dataToSend = Object.entries(selectedDays).map(([day, time]) => ({
        day,
        time,
      }));
    console.log("elderlyId:" + elderlyId +  dataToSend)
      await axios.put(`http://localhost:8080/Elderly/${elderlyId}/updateCleaningDaysForElderly`, {
        PreferredCleaningTime: dataToSend,
      });

      message.success('ימי הניקיון עודכנו בהצלחה');
    } catch (err) {
      message.error('שגיאה בעדכון ימי ניקיון');
    } finally {
      setLoading(false);
    }
  };

  const hebrewDays = {
    sunday: 'ראשון',
    monday: 'שני',
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    shabos: 'שבת',
  };

  const dayOptions = DayInWeek
    ? Object.values(DayInWeek).map((dayValue) => ({
        label: hebrewDays[dayValue] || dayValue,
        value: dayValue,
      }))
    : [];

  return (
    <div style={{ direction: 'rtl', maxWidth: 400, margin: '0 auto' }}>
      <h3>בחר את ימי הניקיון המועדפים:</h3>
      {loading || loadingDayInWeek ? (
        <Spin />
      ) : (
        <>
          <Checkbox.Group
            options={dayOptions}
            value={Object.keys(selectedDays)}
            onChange={handleDayChange}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          />
          {Object.entries(selectedDays).map(([day, time]) => (
            <div key={day} style={{ marginTop: '0.5rem' }}>
              <label>{hebrewDays[day]} - שעה:</label>
              <TimePicker
                value={dayjs(time, 'HH:mm')}
                format="HH:mm"
                onChange={(value) => handleTimeChange(day, value)}
              />
            </div>
          ))}
          <Button type="primary" onClick={handleSave} style={{ marginTop: '1rem' }}>
            שמור
          </Button>
        </>
      )}
    </div>
  );
};

export default DaysOfCleaning;
