const ElderlyModule = require("../Modules/ElderlyModule");
const {addParticipant,deleteParticipant} = require("./ActivityController")
const{updateElderlyIdForApartment} = require("./ApartmentController")
async function getAll(req, res) {
    let arrE = await ElderlyModule.find();
    res.status(200).send(arrE);
}

async function getById(req, res) {
    let e = await ElderlyModule.findById(req.params.id);
    res.status(200).send(e);
}
//בפונקציית יצירת זקן חדש : יוצרים זקן ומיד מעדכנים את היוזר שלו להכיל את הרפרנס אליו.
const {updateUserReference} = require("./UserController");
const {deleteUserFromQueueByIdFromLocal} = require("./ManagmerController");
const { UserStatus } = require("../Constants/enums");
async function create(req, res) {
    //Status מגיעה יחד עם שאר הפרטים של הזקן למרות שלא חלק מהאישי-הוא נלקח הצד לקוח מהסלייס יוזר
    if (req.body.Status !== UserStatus.CONFIRMED) {
        return res.status(500).send({ message: "The status of the elderly must be CONFIRMED" });
    }
    else{
    let e = new ElderlyModule(req.body);
    await e.save();
    //עידכון הרפרנס של הזקן ביוזר שלו.
    await updateUserReference(e._id,e.RefId);
    // מוציאים אותו מהתור של המנהל ומעדכנים את הסטטוס להיות פעיל
    deleteUserFromQueueByIdFromLocal(null,e._id);
    res.status(200).send(e);
    }
}

async function deleteById(req, res) {
    let e = await ElderlyModule.findByIdAndDelete(req.params.id);
    res.status(200).send(e);
}

async function update(req, res) {
    let e = await ElderlyModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(e);
}
async function updateApartmentForElderly(req, res) {
    updateElderlyIdForApartment(req, res) //עדכון דירה לקשיש
    const elderlyId = req.params.id;  // מזהה הזקן
    const { apartmentId } = req.body; // מזהה הדירה החדשה
    
    try {
        // חיפוש הזקן ב-Database
        const elderly = await ElderlyModule.findById(elderlyId);
        
        if (!elderly) {
            return res.status(404).send("Elderly not found");
        }
        
        // עדכון ApartmentId של הזקן
        elderly.ApartmentId = apartmentId;

        // שמירת השינויים במסד הנתונים
        await elderly.save();
        
        console.log("Apartment updated successfully");
        res.status(200).send(elderly);
    } catch (err) {
        console.error("Error updating apartment:", err.message);
        res.status(500).send("Error updating apartment");
    }
}

async function getAllElderlyWithApartments(req, res) {
    let arr = await ElderlyModule.find().populate("ApartmentNumber");
    res.status(200).send(arr);
}

async function getByIdWithApartment(req, res) {
    let e = await ElderlyModule.findById(req.params.id).populate("ApartmentNumber");
    res.status(200).send(e);
}

async function getAllElderlyWithActivities(req, res) {
    let arr = await ElderlyModule.find().populate("ActivitiesList");
    res.status(200).send(arr);
}

async function getByIdWithActivities(req, res) {
    // const manager=await getElderlyByUserIdFromLocal(req.params.id)
    // const ElderlyId=manager._id
    let e = await ElderlyModule.findById(req.params.id).populate("ActivitiesList");
    res.status(200).send(e);
}
const mongoose = require("mongoose");
async function getElderlyByUserIdFromLocal(_id) {
    try {
        const manager = await ElderlyModule.findOne({ RefId :new mongoose.Types.ObjectId( _id) });
        if (!manager) {
            return null;
        }
        return manager;
    } catch (err) {
        console.error("Error fetching elderly by user ID:", err);
        return null;
    }
}
async function getByIdWithApartmentAndActivity(req, res) {
    let e = await ElderlyModule.findById(req.params.id)
        .populate("ActivitiesList")
        .populate("ApartmentNumber");
    res.status(200).send(e);
}

async function getAllWithApartmentAndActivity(req, res) {
    let arr = await ElderlyModule.find()
        .populate("ActivitiesList")
        .populate("ApartmentNumber");
    res.status(200).send(arr);
}
async function addActivityToElderly(req, res) {
    //////////////////////
    addParticipant(req, res) //הוספת משתתף לפעילות
    //צריך להוסיף בדיקה אם יש מקום
    const elderlyId = req.params.id; 
    console.log(elderlyId)// מזהה הזקן
    const activityId = req.body.activityId; // מזהה הפעילות להוספה
    try {
        const elderly = await ElderlyModule.findById(elderlyId);
        if (!elderly) {
            throw new Error("Elderly not found");
        }

        // בדיקה שהפעילות עדיין לא קיימת ברשימה
        if (!elderly.ActivitiesList.includes(activityId)) {
            elderly.ActivitiesList.push(activityId);
            await elderly.save();
            console.log("Activity added successfully");
            res.send(activityId);
        } else {
            console.log("Activity already exists in the list");
        }
    } catch (err) {
        console.error("Failed to add activity:", err.message);
    }
}
async function removeActivityFromElderly(req, res) {
    const elderlyId = req.params.id; 
    const activityId = req.body.activityId; // מזהה הפעילות למחיקה
    deleteParticipant(req, res) //מחיקת משתתף מהפעילות
    try {
        const elderly = await ElderlyModule.findById(elderlyId);
        if (!elderly) {
            throw new Error("Elderly not found");
        }

        // סינון הרשימה כך שלא תכלול את הפעילות שברצונך למחוק
        const originalLength = elderly.ActivitiesList.length;
        elderly.ActivitiesList = elderly.ActivitiesList.filter(
            id => id.toString() !== activityId.toString()
        );

        if (elderly.ActivitiesList.length === originalLength) {
            console.log("Activity not found in the list");
            return res.status(404).send("Activity not found in the list");
        }

        await elderly.save();
        console.log("Activity removed successfully");
        res.send(activityId);
    } catch (err) {
        console.error("Failed to remove activity:", err.message);
        res.status(500).send("Error removing activity");
    }
}
async function getElderlyByUserId(req, res) {
    try {
        const {_id} = req.params;
        console.log("in getElderlyByUserId: " + _id);
        console.log("before findOne: " + new mongoose.Types.ObjectId( _id));        
        if (!mongoose.Types.ObjectId.isValid(_id)) 
            return res.status(400).send({ message: "Invalid ID format" });       
        if(!_id) 
            return res.status(400).send({ message: "ID is required" });       
        const elderly = await ElderlyModule.findOne({ RefId: new mongoose.Types.ObjectId(_id) });
        if (!elderly) {
            console.log("Manager not found...");
            return res.status(404).send({ message: "Elderly not found..." });
        }
        console.log("Elderly found: " + elderly);
        res.status(200).send(elderly);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error", error: err.message });
    }
}
async function updateCleaningDaysForElderly(req, res) {
    const elderlyId = req.params.id;  // מזהה הזקן
    const { PreferredCleaningTime } = req.body; // מערך של ימים
  console.log("PreferredCleaningDays", req.body)
    // // בדיקה שהגיע מערך תקני
    // if (!Array.isArray(cleaningDays)&&cleaningDays!== null) {
    //     return res.status(400).send({ message: "cleaningDays must be an array of strings" });
    // }

    try {
        const elderly = await ElderlyModule.findById(elderlyId);

        if (!elderly) {
            return res.status(404).send({ message: "Elderly not found" });
        }

        // עדכון הימים
        elderly.PreferredCleaningTime = PreferredCleaningTime;

        await elderly.save();

        res.status(200).send(elderly);
    } catch (err) {
        console.error("Error updating cleaning days:", err.message);
        res.status(500).send({ message: "Error updating cleaning days" });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    deleteById,
    update,
    getAllElderlyWithApartments,
    getByIdWithApartment,
    getAllElderlyWithActivities,
    getByIdWithActivities,
    getByIdWithApartmentAndActivity,
    getAllWithApartmentAndActivity,
    addActivityToElderly,
    removeActivityFromElderly,
    updateApartmentForElderly,
    getElderlyByUserId,
    updateCleaningDaysForElderly
};
