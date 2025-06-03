const express = require("express")
const router = express.Router()
const {getAll, getById, create, deleteById, update, getAllElderlyWithApartments,
    getByIdWithApartment, getAllElderlyWithActivities, getByIdWithActivities,
    getByIdWithApartmentAndActivity, getAllWithApartmentAndActivity,
    addActivityToElderly, removeActivityFromElderly, updateApartmentForElderly,
    getElderlyByUserId, updateCleaningDaysForElderly } = require("../Controllers/ElderlyController")
const{verifyToken}=require("../auth")

router.post("/create",verifyToken, create)
router.get("/getAll",verifyToken, getAll)
router.get("/getById/:id",verifyToken, getById)
router.delete("/deleteById/:id",verifyToken, deleteById)
router.put("/update/:id",verifyToken, update)
router.get("/getAllElderlyWithApartments",verifyToken, getAllElderlyWithApartments)
router.get("/getAllElderlyWithActivities",verifyToken, getAllElderlyWithActivities)
router.get("/getByIdWithApartment/:id",verifyToken, getByIdWithApartment)
router.get("/getByIdWithActivities/:id",verifyToken, getByIdWithActivities)
router.get("/getByIdWithApartmentAndActivity/:id",verifyToken, getByIdWithApartmentAndActivity)
router.get("/getAllWithApartmentAndActivity",verifyToken, getAllWithApartmentAndActivity)
router.get("/:_id/getElderlyByUserId",verifyToken, getElderlyByUserId)
router.patch("/:id/addActivityToElderly",verifyToken, addActivityToElderly)
router.patch("/:id/removeActivityFromElderly",verifyToken, removeActivityFromElderly)
router.patch("/updateApartmentForElderly/:id",verifyToken, updateApartmentForElderly)
router.put('/:id/updateCleaningDaysForElderly',verifyToken, updateCleaningDaysForElderly);
module.exports = router


