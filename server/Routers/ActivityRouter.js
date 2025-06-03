const express = require("express")
const router = express.Router()
const {createToken} = require("../auth")
const {getAll,getById,create,deleteById,update,getByIdWithParticipantsList,getAllWithParticipantsList,addParticipant} = require("../Controllers/ActivityController")
const{verifyToken}=require("../auth")

router.post("/create",verifyToken,create)
router.get("/getAll",getAll)
router.get("/getById/:id",verifyToken,getById)
router.delete("/deleteById/:id",verifyToken,deleteById)
router.put("/update/:id",verifyToken,update)
router.get("/getByIdWithParticipantsList/:id",getByIdWithParticipantsList)
router.get("/getAllWithParticipantsList",getAllWithParticipantsList)
router.patch("/addParticipant/:id",verifyToken,addParticipant)
module.exports = router


