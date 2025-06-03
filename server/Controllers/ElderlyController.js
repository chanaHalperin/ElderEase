const ElderlyModule = require("../Modules/ElderlyModule");
const { addParticipant, deleteParticipant } = require("./ActivityController")
const { updateElderlyIdForApartment } = require("./ApartmentController")
const { updateUserReference } = require("./UserController");
const { deleteUserFromQueueByIdFromLocal } = require("./ManagmerController");
const { UserStatus } = require("../Constants/enums");
async function create(req, res) {
    if (req.body.Status !== UserStatus.CONFIRMED) {
        return res.status(500).send({ message: "The status of the elderly must be CONFIRMED" });
    }
    else {
        let e = new ElderlyModule(req.body);
        await e.save();
        //עידכון הרפרנס של הזקן ביוזר שלו.
        await updateUserReference(e._id, e.RefId);
        // מוציאים אותו מהתור של המנהל ומעדכנים את הסטטוס להיות פעיל
        deleteUserFromQueueByIdFromLocal(null, e._id);
        const newreq = {
            params: {
                id:  e._id //מזהה הזקן שאתה רוצה להעביר
            },
            body: {
                apartmentId: e.ApartmentId //צריך גם מזהה דירה בגוף הבקשה
            }
        };
        updateElderlyIdForApartment(newreq, res) //עדכון דירה לקשיש
        res.status(200).send(e);
    }
}
async function getAll(req, res) {
    let arrE = await ElderlyModule.find();
    res.status(200).send(arrE);
}

async function getById(req, res) {
    let e = await ElderlyModule.findById(req.params.id);
    res.status(200).send(e);
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
        if (!elderly) 
            return res.status(404).send("Elderly not found");
        elderly.ApartmentId = apartmentId;
        await elderly.save();
        res.status(200).send(elderly);
    } catch (err) {
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
    let e = await ElderlyModule.findById(req.params.id).populate("ActivitiesList");
    res.status(200).send(e);
}
const mongoose = require("mongoose");
async function getElderlyByUserIdFromLocal(_id) {
    try {
        const manager = await ElderlyModule.findOne({ RefId: new mongoose.Types.ObjectId(_id) });
        if (!manager) {
            return null;
        }
        return manager;
    } catch (err) {
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
    try {
        const result = await addParticipant(req); // בלי להעביר את res
        if (!result.success) {
            return res.status(result.status).send({ error: result.error });
        }
        const elderlyId = req.params.id;
        const activityId = req.body.activityId;
        const elderly = await ElderlyModule.findById(elderlyId);
        if (!elderly) 
            return res.status(404).send("Elderly not found");
        if (!elderly.ActivitiesList.includes(activityId)) {
            elderly.ActivitiesList.push(activityId);
            await elderly.save();
            return res.send(activityId);
        } else {
            return res.status(200).send("Activity already exists");
        }
    } catch (err) {
        return res.status(500).send({ error: "שגיאה כללית בהוספת פעילות" });
    }
}

async function removeActivityFromElderly(req, res) {
    const elderlyId = req.params.id;
    const activityId = req.body.activityId; // מזהה הפעילות למחיקה
    deleteParticipant(req, res) //מחיקת משתתף מהפעילות
    try {
        const elderly = await ElderlyModule.findById(elderlyId);
        if (!elderly) {
             return res.status(404).send("Elderly not found");
        }
        const originalLength = elderly.ActivitiesList.length;
        elderly.ActivitiesList = elderly.ActivitiesList.filter(
            id => id.toString() !== activityId.toString()
        );
        if (elderly.ActivitiesList.length === originalLength)   
            return res.status(404).send("Activity not found in the list");
        await elderly.save();
        res.send(activityId);
    } catch (err) {
        res.status(500).send("Error removing activity");
    }
}

async function getElderlyByUserId(req, res) {
    try {
        const { _id } = req.params;
        const cleaner = await ElderlyModule.findOne({ RefId: new mongoose.Types.ObjectId(_id) });
        if (!cleaner) {
            return res.status(404).send({ message: "cleaner not found..." });
        }
        res.status(200).send(cleaner);
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message });
    }
}

async function updateCleaningDaysForElderly(req, res) {
    const elderlyId = req.params.id;  // מזהה הזקן
    const { PreferredCleaningTime } = req.body; // מערך של ימים
    try {
        const elderly = await ElderlyModule.findById(elderlyId);
        if (!elderly) 
            return res.status(404).send({ message: "Elderly not found" });
        // עדכון הימים
        elderly.PreferredCleaningTime = PreferredCleaningTime;
        await elderly.save();
        res.status(200).send(elderly);
    } catch (err) {
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
