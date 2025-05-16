const express = require("express")
const router = express.Router()
const {/*getAll,*/getFirstOrById,create,deleteById,update,getByIdWithQueueElderlyToSignIn
    ,addUserToQueue,getQueueByRole,deleteUserFromQueueByIdRole,getManagerByUserId} 
    = require("../Controllers/ManagmerController")

router.post("/create",create)
// router.get("/getAll",getAll)
router.get("/getFirstOrById/:id?",getFirstOrById)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",update)
router.post("/:id/deleteUserFromQueueByIdRole",deleteUserFromQueueByIdRole)
router.get("/getByIdWithQueueElderlyToSignIn/:id",getByIdWithQueueElderlyToSignIn)
router.post("/addUserToQueue/:id?",addUserToQueue)//לא חובה לשלוח מזהה מנהל, אם לא ישלח יקח את המנהל הראשון
router.post("/:id/getQueueByRole",getQueueByRole)
router.get("/getManegerByUserId/:_id",getManagerByUserId)
module.exports = router


