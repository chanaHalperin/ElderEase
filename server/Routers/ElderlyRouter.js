const express = require("express")
const router = express.Router()
const { getAll, getById, create, deleteById, update, getAllElderlyWithApartments,
    getByIdWithApartment, getAllElderlyWithActivities, getByIdWithActivities,
    getByIdWithApartmentAndActivity, getAllWithApartmentAndActivity,
    addActivityToElderly, removeActivityFromElderly, updateApartmentForElderly,
    getElderlyByUserId, updateCleaningDaysForElderly } = require("../Controllers/ElderlyController")

router.post("/create", create)
router.get("/getAll", getAll)
router.get("/getById/:id", getById)
router.delete("/deleteById/:id", deleteById)
router.put("/update/:id", update)
router.get("/getAllElderlyWithApartments", getAllElderlyWithApartments)
router.get("/getAllElderlyWithActivities", getAllElderlyWithActivities)
router.get("/getByIdWithApartment/:id", getByIdWithApartment)
router.get("/getByIdWithActivities/:id", getByIdWithActivities)
router.get("/getByIdWithApartmentAndActivity/:id", getByIdWithApartmentAndActivity)
router.get("/getAllWithApartmentAndActivity", getAllWithApartmentAndActivity)
router.get("/:_id/getElderlyByUserId", getElderlyByUserId)
router.patch("/:id/addActivityToElderly", addActivityToElderly)
router.patch("/:id/removeActivityFromElderly", removeActivityFromElderly)
router.patch("/updateApartmentForElderly/:id", updateApartmentForElderly)
router.put('/:id/updateCleaningDaysForElderly', updateCleaningDaysForElderly);
module.exports = router


