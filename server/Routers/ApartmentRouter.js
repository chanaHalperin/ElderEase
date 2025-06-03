const express = require("express")
const router = express.Router()
const {getAll,getById,create,deleteById,update,updateElderlyIdForApartment} = require("../Controllers/ApartmentController")
const{verifyToken}=require("../auth")
router.post("/create",verifyToken,create)
router.get("/getAll",getAll)
router.get("/getById/:id",getById)
router.delete("/deleteById/:id",verifyToken,deleteById)
router.put("/update/:id",verifyToken,update)
router.patch("/updateElderlyIdForApartment/:id",verifyToken,updateElderlyIdForApartment)
module.exports = router


