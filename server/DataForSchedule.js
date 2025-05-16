const Elderly = require('./Modules/ElderlyModule');
const Cleaner = require('./Modules/CleanerModule');

async function getCleaningData() {
  const timeOfCleanForMeter = 2.5; // זמן ניקוי  של מטר רבוע
  try {
    // שליפת זקנים עם דירתם
    const elderlyList = await Elderly.find()
      .populate({ path: 'ApartmentId', select: 'SizeInSquareMeters' }) // שולף רק את גודל הדירה
      .lean();

    const cleanerList = await Cleaner.find().lean();

    const processedElderly = elderlyList.map(e => {
      const apartmentSize = e.ApartmentId?.SizeInSquareMeters || 0;
      const cleaningDuration = apartmentSize * timeOfCleanForMeter; // בדקות

      return {
        id: e._id,
        preferredTimes: e.PreferredCleaningTime, // [{ day: 'monday', time: '10:00' }, ...]
        apartmentSize: apartmentSize,
        cleaningDurationMinutes: cleaningDuration,
      };
    });

    const processedCleaners = cleanerList.map(c => ({
      id: c._id,
      workDays: c.dayInWork,
    }));

    // console.log('processedElderly', JSON.stringify(processedElderly, null, 2));
    // console.log('processedCleaners', JSON.stringify(processedCleaners, null, 2));

    return { elderlyList: processedElderly, cleanerList: processedCleaners };
  } catch (err) {
    console.error('שגיאה בשליפה:', err);
    return { elderlyList: [], cleanerList: [] };
  }
}

module.exports={getCleaningData}

