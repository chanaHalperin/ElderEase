const ManagerModule = require("../Modules/ManagerModule");

// The management is a singleton.
// async function getAll(req, res) {
//     let arrM = await ManagerModule.find();
//     res.status(200).send(arrM);
// }

async function getFirstOrById(req, res) {
    try {
        let m;
        if (req.params.id) 
            m = await ManagerModule.findById(req.params.id);
        else 
            m = await ManagerModule.findOne(); // מחזיר את הראשון
        if (!m) return res.status(404).send({ message: 'Manager not found' });
        res.status(200).send(m);
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
}
async function getFirstOrByIdInLocal(id = 0) {
    let m;
    try {
        if (id != 0) 
            m = await ManagerModule.findById(id);
         else 
            m = await ManagerModule.findOne(); // מחזיר את הראשון                
        if (!m) {
            return null;
        }       
        return m;
    } catch (error) {
        throw error; // זרוק את השגיאה כדי לטפל בה מאוחר יותר
    }
}
async function addUserToQueue(req, res) {
    try {
        const user_id = req.body.user_id;
        var manager;
        let managerId;
        if (req.params.id) 
            managerId = req.params.id; // אם ה-id נשלח, השתמש בו
        else 
        {
            manager = await getFirstOrByIdInLocal(); // אחרת, קבל את המנהל הראשון    
            if(!manager)
                res.status(404).send("Manager not found");    
            managerId=manager._id
        }
        if (!managerId) 
            return res.status(404).send("ManagerId not found");
        //פה מכניסים אותו לתור של המנהל        
        const updatedManager = await ManagerModule.findByIdAndUpdate(
            managerId,
            { $push: { QueueElderlyToSignIn: user_id } },
            { new: true }
        );
        //פה מעדכנים לו את הסטטוס להיות ממתין
        await updateUserStatusFromLocal(user_id,UserStatus.PENDING);
        res.status(200).send(updatedManager);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
async function getManagerByUserId(req, res) {
    try {
        const {_id} = req.params;
        const manager = await ManagerModule.findOne({ RefId :new mongoose.Types.ObjectId( _id) });
        if (!manager) {
            return res.status(404).send({ message: "Manager not found..." });
        }
        res.status(200).send(manager);
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message });
    }
}
//בפונקציית יצירת מנהל חדש : יוצרים מנהל ומיד מעדכנים את היוזר שלו להכיל את הרפרנס אליו.
const {updateUserReference} = require("./UserController");
async function create(req, res) {
    //Status מגיעה יחד עם שאר הפרטים של הזקן למרות שלא חלק מהאישי-הוא נלקח הצד לקוח מהסלייס יוזר
    if (req.body.Status != UserStatus.CONFIRMED) {
        return res.status(500).send({ message: "The status of the manager must be CONFIRMED" });
    } 
    else{
    //פה אני רוצה להוסיף לreq.body את השורה הזאת:  "QueueElderlyToSignIn": []
    req.body.QueueElderlyToSignIn = [];
    let m = await new ManagerModule(req.body);
    await m.save();
    //עידכון הרפרנס של הזקן ביוזר שלו.
    await updateUserReference(m._id,m.RefId);
    // מוציאים אותו מהתור של המנהל ומעדכנים את הסטטוס להיות פעיל
    deleteUserFromQueueByIdFromLocal(null,m._id);
    res.status(200).send(m);}
}

async function deleteById(req, res) {
    let m = await ManagerModule.findByIdAndDelete(req.params.id);
    res.status(200).send(m);
}

async function update(req, res) {
    let m = await ManagerModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(m);
}

async function getByIdWithQueueElderlyToSignIn(req, res) {
    let m = await ManagerModule.findById(req.params.id).populate('QueueElderlyToSignIn');
    res.status(200).send(m);
}

async function getQueueByRole(req, res) {
    try {
        const managerId = req.params.id; // מזהה המנהל
        const role= req.body.role; // תפקיד המנהל
        const manager = await ManagerModule.findById(managerId).populate('QueueElderlyToSignIn');
        if (!manager) {
            return res.status(404).send({ message: "Manager not found" });
        }
        // סינון לפי Role ששווה ל-elderly
        const elderlyQueue = manager.QueueElderlyToSignIn.filter(user => user.Role === role);
        res.status(200).send(elderlyQueue); // מחזיר את רשימת הזקנים המסוננת
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const mongoose = require("mongoose");
const {UserStatus}=require("../Constants/enums")
const {updateUserStatusFromLocal} = require("./UserController");
async function deleteUserFromQueueByIdRole(req, res) {
    try {
        const managerId = req.params.id; // מזהה המנהל
        const { userId, newStatus } = req.body; // מזהה המשתמש
        // בדיקה אם ה-userId הוא תקין
        if (!mongoose.Types.ObjectId.isValid(userId)) 
            return res.status(400).send({ message: "Invalid userId format" });
        // עדכון התור על ידי הסרת המשתמש לפי userId
        const updatedManager = await ManagerModule.findByIdAndUpdate(
            managerId,
            {$pull: { QueueElderlyToSignIn: userId }
            },{ new: true }
        ) // מחזיר את התור המעודכן
        if (!updatedManager) 
            return res.status(404).send({ message: "Manager not found" });
        //מעדכן את הסטטוס של היוזר להיות לפי הפרמטר הנשלח
        await updateUserStatusFromLocal(userId,newStatus);
        res.status(200).send(updatedManager); // מחזיר את המנהל המעודכן
    } catch (err) {
        res.status(500).send(err.message);
    }
}
async function deleteUserFromQueueByIdFromLocal(managerId, userId) {
    try {
        // בדיקה אם ה-userId הוא תקין
        if (!mongoose.Types.ObjectId.isValid(userId)) 
            return  "Invalid userId format" ;
        // עדכון התור על ידי הסרת המשתמש לפי userId
        if(managerId==null)
            managerId=await ManagerModule.findOne()._id;
        const updatedManager = await ManagerModule.findByIdAndUpdate(
            managerId,
            {$pull: { QueueElderlyToSignIn: userId }
            },{ new: true }
        ) // מחזיר את התור המעודכן
        if (!updatedManager) 
            return null;
        //מעדכן את הסטטוס ל היוזר המוסר להיות פעיל
        await updateUserStatusFromLocalDb(userId,UserStatus.ACTIVE);
        return(updatedManager); // מחזיר את המנהל המעודכן
    } catch (err) {
        return(err.message);
    }
}
module.exports = {
    /*getAll,*/ getFirstOrById, create, deleteById, update, getByIdWithQueueElderlyToSignIn,
     addUserToQueue,getQueueByRole,deleteUserFromQueueByIdRole,getManagerByUserId,deleteUserFromQueueByIdFromLocal
};
