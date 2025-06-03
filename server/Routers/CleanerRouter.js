const express = require("express")
const router = express.Router()
const {getAll,getById,create,deleteById,update,getCleanerByUserId} = require("../Controllers/CleanerController")
const{verifyToken}=require("../auth")
router.post("/create",verifyToken,create)
router.get("/getAll",verifyToken,getAll)
router.get("/getById/:id",verifyToken,getById)
router.delete("/deleteById/:id",verifyToken,deleteById)
router.put("/update/:id",verifyToken,update)
router.get("/getCleanerByUserId/:_id",verifyToken, getCleanerByUserId)
module.exports = router


