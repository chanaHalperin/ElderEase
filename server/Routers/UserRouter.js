const express = require("express")
const router = express.Router()
const {getAll,getById,create,deleteById,update,getByPassword,getByIdNumber,
    getByIdWithPopulate
} = require("../Controllers/UserController")
const {createToken} = require("../MiddleWares/auth")

router.post("/create",createToken,create)
router.get("/getAll",getAll)
router.get("/getById/:id",getById)
router.get("/getByIdWithPopulate/:id",getByIdWithPopulate)
router.get("/getByPassword/:password",getByPassword)
router.post("/getByIdNumber",getByIdNumber)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",update)

module.exports = router


