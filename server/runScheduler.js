const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');
const { getCleaningData } = require('./DataForSchedule');
const ApartmentClean = require('./Modules/AppartmentCleanModule');
const mongoose = require('mongoose');

async function saveSchedule(schedule) {
  if (!Array.isArray(schedule)) throw new Error("Expected array");

  await ApartmentClean.deleteMany({});

  const bulkOps = schedule
    .filter(item => item.cleanerId)
    .map(item => ({
      updateOne: {
        filter: { AppartmentId: new mongoose.Types.ObjectId(item.apartmentId), Day: item.day },
        update: {
          $set: {
            cleanerId: new mongoose.Types.ObjectId(item.cleanerId),
            StartTime: item.startTime,
            EndTime: item.endTime,
            Comments: item.note || ''
          }
        },
        upsert: true
      }
    }));

  if (bulkOps.length > 0) {
    await ApartmentClean.bulkWrite(bulkOps);
  }

  return schedule;
}

async function runScheduler() {
  return new Promise(async (resolve, reject) => {
    let tempPath = null;
    try {
      const data = await getCleaningData();
      tempPath = path.join(__dirname, 'temp_input.json');
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');

      const options = {
        scriptPath: path.join(__dirname, '../python'),
        args: [tempPath],
        pythonOptions: ['-u'],
        pythonPath: 'python'
      };

      const pyshell = new PythonShell('cleaning_scheduler.py', options);
      let outputLines = [], errorLines = [];

      pyshell.on('message', msg => outputLines.push(msg));
      pyshell.on('stderr', err => errorLines.push(err));

      pyshell.end(async (err) => {
        try {
          if (err) throw err;
          if (errorLines.length) console.log(errorLines.join('\n'));

          const result = JSON.parse(outputLines.join(''));
          const saved = await saveSchedule(result);
          resolve(saved);
        } catch (e) {
          reject(e);
        } finally {
          if (tempPath) {
            try { fs.unlinkSync(tempPath); } catch (_) {}
          }
        }
      });
    } catch (e) {
      if (tempPath) {
        try { fs.unlinkSync(tempPath); } catch (_) {}
      }
      reject(e);
    }
  });
}

module.exports = { runScheduler };