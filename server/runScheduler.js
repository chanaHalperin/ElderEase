// const { PythonShell } = require('python-shell');
// const {getCleaningData }= require('./DataForSchedule.js');
// // const{isSchedulerToRun}=require("./Config/Global.js")
// async function runScheduler() {
//   const data = await getCleaningData();

//   const options = {
//     scriptPath: './python', // התיקייה שבה scheduler.py נמצא
//     args: [JSON.stringify(data)],
//     pythonOptions: ['-u'] // שומר על output חי
//   };

//   PythonShell.run("C:/Users/Windows 11/Desktop/H.W/RamatTamirProject/python/cleaning_scheduler.py", options, function (err, results) {
//     if (err) throw err;

//     try {
//       const output = JSON.parse(results.join(""));
//       console.log("שיבוץ מוצלח:");
//       console.table(output);
//     } catch (parseError) {
//       console.error("שגיאה בפיענוח תוצאה:", parseError);
//       console.log("פלט גולמי:", results);
//     }
//   });
// }

// module.exports = { runScheduler };
const { PythonShell } = require('python-shell');
const { getCleaningData } = require('./DataForSchedule.js');

async function runScheduler() {
  const data = await getCleaningData();

  const path = require('path');

const options = {
  scriptPath: path.join(__dirname, '../python'),
  args: [JSON.stringify(data)],

  pythonOptions: ['-u']
};
// console.log("מצביע על הקובץ:", path.join(__dirname, '../python', 'cleaning_scheduler.py'));

  // כאן שינינו מ-נתיב מלא -> רק שם הקובץ

  PythonShell.run("cleaning_scheduler.py", options, function (err, results) {
    if (err) throw err;

    try {
      const output = JSON.parse(results.join(""));
      console.log("שיבוץ מוצלח:");
      console.table(output);
    } catch (parseError) {
      console.error("שגיאה בפיענוח תוצאה:", parseError);
      console.log("פלט גולמי:", results);
    }
  });
}

module.exports = { runScheduler };
