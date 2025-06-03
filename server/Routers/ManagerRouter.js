const express = require("express")
const router = express.Router()
const {/*getAll,*/getFirstOrById,create,deleteById,update,getByIdWithQueueElderlyToSignIn
    ,addUserToQueue,getQueueByRole,deleteUserFromQueueByIdRole,getManagerByUserId} 
    = require("../Controllers/ManagmerController")
const{verifyToken}=require("../auth")
router.post("/create",create)
// router.get("/getAll",getAll)
router.get("/getFirstOrById/:id?",getFirstOrById)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",update)
router.post("/:id/deleteUserFromQueueByIdRole",verifyToken,deleteUserFromQueueByIdRole)
router.get("/getByIdWithQueueElderlyToSignIn/:id",verifyToken,getByIdWithQueueElderlyToSignIn)
router.post("/addUserToQueue/:id?",verifyToken,addUserToQueue)//לא חובה לשלוח מזהה מנהל, אם לא ישלח יקח את המנהל הראשון
router.post("/:id/getQueueByRole",verifyToken,getQueueByRole)
router.get("/getManegerByUserId/:_id",verifyToken,getManagerByUserId)
module.exports = router


