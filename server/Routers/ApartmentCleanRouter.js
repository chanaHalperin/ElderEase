const express = require("express")
const router = express.Router()
const {getAll,getById,create,deleteById,update,getByIdWithCleaner,getAllWithCleaner,getByCleanerId,getByAppartmentId} = require("../Controllers/AppartmentCleanController")

router.post("/create",create)
router.get("/getAll",getAll)
router.get("/getById/:id",getById)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",update)
router.get("/getByIdWithCleaner/:id",getByIdWithCleaner)
router.get("/getAllWithCleaner",getAllWithCleaner)
router.get("/getByCleanerId/:cleanerId",getByCleanerId)
router.get("/getByAppartmentId/:AppartmentId",getByAppartmentId)

module.exports = router


