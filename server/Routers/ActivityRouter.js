const express = require("express")
const router = express.Router()
const {createToken} = require("../MiddleWares/auth")
const {getAll,getById,create,deleteById,update,getByIdWithParticipantsList,getAllWithParticipantsList,addParticipant} = require("../Controllers/ActivityController")

router.post("/create",create)
router.get("/getAll",getAll)
router.get("/getById/:id",getById)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",update)
router.get("/getByIdWithParticipantsList/:id",getByIdWithParticipantsList)
router.get("/getAllWithParticipantsList",getAllWithParticipantsList)
router.patch("/addParticipant/:id",addParticipant)
module.exports = router


