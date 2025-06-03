const express = require("express")
const router = express.Router()
const {getAll,getById,create,deleteById,update,getByPassword,getByIdNumber,
    getByIdWithPopulate
} = require("../Controllers/UserController")
const {createToken,verifyToken} = require("../auth")

router.post("/create",createToken,create)
router.get("/getAll",verifyToken,getAll)
router.get("/getById/:id",getById)
router.get("/getByIdWithPopulate/:id",verifyToken,getByIdWithPopulate)
router.get("/getByPassword/:password",getByPassword)
router.post("/getByIdNumber",getByIdNumber)
router.delete("/deleteById/:id",deleteById)
router.put("/update/:id",verifyToken,update)

module.exports = router


