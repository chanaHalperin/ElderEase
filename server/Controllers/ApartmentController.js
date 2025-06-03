const ApartmentModules = require("../Modules/ApartmentModule");
const { ApartmentStatus } = require("../Constants/enums")

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
    const elderlyId = req.params.id; 
    const { apartmentId } = req.body; 

    try {
        const apartment = await ApartmentModules.findById(apartmentId);
        if (!apartment) {
            return { success: false, status: 404, error: "Apartment not found" };
        }
        apartment.ElderlyId = elderlyId;
        apartment.status = ApartmentStatus.OCCUPIED; // עדכון הסטטוס לדירה תפוסה
        await apartment.save();
        return { success: true, status: 200};
    } catch (err) {
        return { success: false, status: 500, error: "Error update elferly id" };
    }
}

module.exports = { getAll, getById, create, deleteById, update, updateElderlyIdForApartment };
