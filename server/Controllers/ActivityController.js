const ActivityModule = require("../Modules/ActivityModule");

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
async function addParticipant(req) {
    const activityId = req.body.activityId;
    const elderlyId = req.params.id;

    try {
        const activity = await ActivityModule.findById(activityId);
        if (!activity) {
            return { success: false, status: 404, error: "Activity not found" };
        }

        if (activity.participantsList.includes(elderlyId)) {
            return { success: false, status: 400, error: "Participant already added" };
        }

        if (activity.participantsList.length >= activity.MaxParticipants) {
            return { success: false, status: 400, error: "Maximum number of participants reached" };
        }

        activity.participantsList.push(elderlyId);
        await activity.save();
        return { success: true, activity };
    } catch (error) {
        return { success: false, status: 500, error: "Failed to add participant" };
    }
}

async function deleteParticipant(req, res) {
    const elderlyId = req.params.id;
    const activityId = req.body.activityId; // מזהה הפעילות למחיקה

    try {
        const activity = await ActivityModule.findById(activityId);

        if (!activity) {
            return { success: false, status: 404, error: "Activity not found" };
        }

        if (!(activity.participantsList.includes(elderlyId))) {
            return { success: false, status: 400, error: "Participant not exists" };
        }

        activity.participantsList = activity.participantsList.filter(
            participant => participant.toString() !== elderlyId
        );
        await activity.save();
    } catch (error) {
        return { success: false, status: 500, error: "Failed to add participant" };
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
