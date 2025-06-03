const Elderly = require('./Modules/ElderlyModule');
const Cleaner = require('./Modules/CleanerModule');
const AppClean = require('./Modules/AppartmentCleanModule');
const timeOfCleanForMeter = 2.5;

async function getCleaningData() {
  try {
    const elderlyList = await Elderly.find()
      .populate({ path: 'ApartmentId', select: 'SizeInSquareMeters Name' })
      .lean();

    const cleanerList = await Cleaner.find()
      .populate({ path: 'RefId', select: 'fullName' })
      .lean();

    const existingSchedule = await AppClean.find()
      .populate({ path: 'AppartmentId', select: 'Name' })
      .populate({ path: 'cleanerId', select: 'fullName' })
      .lean();

    const processedElderly = elderlyList
      .filter(e => e.ApartmentId?._id)
      .map(e => {
        const apartmentSize = e.ApartmentId.SizeInSquareMeters || 0;
        return {
          apartmentId: e.ApartmentId._id,
          preferredTimes: e.PreferredCleaningTime,
          apartmentSize,
          cleaningDurationMinutes: apartmentSize * timeOfCleanForMeter
        };
      });

    const processedCleaners = cleanerList.map(c => ({
      id: c._id,
      name: c.RefId?.fullName || '',
      workDays: c.dayInWork
    }));

    const processedExisting = existingSchedule.map(item => ({
      apartmentId: item.AppartmentId._id,
      cleanerId: item.cleanerId?._id,
      day: item.Day,
      startTime: item.StartTime,
      endTime: item.EndTime
    }));

    return {
      elderlyList: processedElderly,
      cleanerList: processedCleaners,
      existingSchedule: processedExisting
    };
  } catch (err) {
    return { elderlyList: [], cleanerList: [], existingSchedule: [] };
  }
}

module.exports = { getCleaningData };

