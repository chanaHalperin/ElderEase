const ApartmentModules = require("../Modules/ApartmentModule");
const {ApartmentStatus}=require("../Constants/enums")

async function getAll(req, res) {
    let arrA = await ApartmentModules.find();
    res.status(200).send(arrA);
}

async function getById(req, res) {
    let a = await ApartmentModules.findById(req.params.id);
    res.status(200).send(a);
}

async function create(req, res) {
    let a = new ApartmentModules(req.body);
    await a.save();
    res.status(200).send(a);
}

async function deleteById(req, res) {
    let a = await ApartmentModules.findByIdAndDelete(req.params.id);
    res.status(200).send(a);
}

async function update(req, res) {
    let a = await ApartmentModules.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(a);
}
async function updateElderlyIdForApartment(req, res) {
    console.log("updateElderlyIdForApartment called")
    const elderlyId = req.params.id;  // מזהה הזקן
    const { apartmentId } = req.body; // מזהה הדירה 
    
    try {
        // חיפוש הדירה ב-Database
        const apartment = await ApartmentModules.findById(apartmentId);
        
        if (!apartment) {
            return res.status(404).send("Apartment not found");
        }
        
        // עדכון ה-ElderlyId בדירה
        apartment.ElderlyId = elderlyId;
        apartment.status = ApartmentStatus.OCCUPIED; // עדכון הסטטוס לדירה תפוסה
        
        // שמירת השינויים במסד הנתונים
        await apartment.save();
        
        console.log("ElderlyId updated successfully");
       // res.status(200).send(apartment);
    } catch (err) {
        console.error("Error updating ElderlyId:", err.message);
        //res.status(500).send("Error updating ElderlyId");
    }
}

module.exports = { getAll, getById, create, deleteById, update,updateElderlyIdForApartment };
