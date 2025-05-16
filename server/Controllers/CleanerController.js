const CleanerModule = require("../Modules/CleanerModule");

async function getAll(req, res) {
    let arrC = await CleanerModule.find();
    res.status(200).send(arrC);
}

async function getById(req, res) {
    let c = await CleanerModule.findById(req.params.id);
    res.status(200).send(c);
}
//בפונקציית יצירת מנקה חדש : יוצרים מנקה ומיד מעדכנים את היוזר שלו להכיל את הרפרנס אליו.
const {updateUserReference} = require("./UserController");
const {deleteUserFromQueueByIdFromLocal} = require("./ManagmerController");
const { UserStatus } = require("../Constants/enums");
async function create(req, res) {
   //Status מגיעה יחד עם שאר הפרטים של הזקן למרות שלא חלק מהאישי-הוא נלקח הצד לקוח מהסלייס יוזר
    if (req.body.Status != UserStatus.CONFIRMED) {
        return res.status(500).send({ message: "The status of the cleaner must be CONFIRMED" });
    }
    else{
        req.body.dayInWork = JSON.parse(req.body.dayInWork);
        console.log("req.body  : ", req.body);
    let c = new CleanerModule(req.body);
    
    await c.save();
     //עידכון הרפרנס של הזקן ביוזר שלו.
     await updateUserReference(c._id,c.RefId);
     // מוציאים אותו מהתור של המנהל ומעדכנים את הסטטוס להיות פעיל
     deleteUserFromQueueByIdFromLocal(null,c._id);
    res.status(200).send(c);
    }
}

async function deleteById(req, res) {
    let c = await CleanerModule.findByIdAndDelete(req.params.id);
    res.status(200).send(c);
}

async function update(req, res) {
    let c = await CleanerModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(c);
}

module.exports = { getAll, getById, create, deleteById, update };
