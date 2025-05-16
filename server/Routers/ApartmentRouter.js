const express = require("express")
const router = express.Router()
const {getAll,getById,create,deleteById,update,updateElderlyIdForApartment} = require("../Controllers/ApartmentController")

router.post("/create",create)
router.get("/getAll",getAll)
router.get("/getById/:id",getById)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",update)
router.patch("/updateElderlyIdForApartment/:id",updateElderlyIdForApartment)
module.exports = router


