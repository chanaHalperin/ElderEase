const ActivityModule = require("../Modules/ActivityModule");
const {ApartmentStatus}=require("../Constants/enums")

async function getAll(req, res) {
    let arrA = await ActivityModule.find();
    res.status(200).send(arrA);
}

async function getById(req, res) {
    let ca = await ActivityModule.findById(req.params.id);
    res.status(200).send(ca);
}

async function create(req, res) {
    let a = await new ActivityModule(req.body);
    await a.save();
    console.log(req.body);
    res.status(200).send(a);
}

async function deleteById(req, res) {
    let a = await ActivityModule.findByIdAndDelete(req.params.id);
    res.status(200).send(a);
}

async function update(req, res) {
    let a = await ActivityModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(a);
}

async function getByIdWithParticipantsList(req, res) {
    let a = await ActivityModule.findById(req.params.id).populate('participantsList');
    res.status(200).send(a);
}

async function getAllWithParticipantsList(req, res) {
    let arrA = await ActivityModule.find().populate('participantsList');
    res.status(200).send(arrA);
}
async function addParticipant(req, res) {
    const activityId = req.params.id;
    const { elderlyId } = req.body;

    try {
        const activity = await ActivityModule.findById(activityId);

        if (!activity) {
            return res.status(404).send({ error: "Activity not found" });
        }

        // בדיקה אם כבר רשום
        if (activity.participantsList.includes(elderlyId)) {
            return res.status(400).send({ error: "Participant already added" });
        }

        // בדיקה אם מלא
        if (activity.participantsList.length >= activity.MaxParticipants) {
            return res.status(400).send({ error: "Maximum number of participants reached" });
        }

        // הוספה לרשימה
        activity.participantsList.push(elderlyId);
        await activity.save();

        res.status(200).send(activity);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to add participant" });
    }
}
async function deleteParticipant(req, res) {
    const elderlyId = req.params.id; 
    const activityId = req.body.activityId; // מזהה הפעילות למחיקה

    try {
        const activity = await ActivityModule.findById(activityId);

        if (!activity) {
            return res.status(404).send({ error: "Activity not found" });
        }

        //בדיקה אם לא קיים
        if (!(activity.participantsList.includes(elderlyId))) {
            return res.status(400).send({ error: "Participant not exists" });
        }

           // הסרה מהמערך
           activity.participantsList = activity.participantsList.filter(
            participant => participant.toString() !== elderlyId
        );
        await activity.save();

        res.status(200).send(activity);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to add participant" });
    }
}
module.exports = {
    getAll,
    getById,
    create,
    deleteById,
    update,
    getByIdWithParticipantsList,
    getAllWithParticipantsList,
    addParticipant,
    deleteParticipant
};
