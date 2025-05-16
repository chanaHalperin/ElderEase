const AppartmentCleanModule=require("../Modules/AppartmentCleanModule")

async function getAll(req,res){
    let arrA=await AppartmentCleanModule.find()
    res.status(200).send(arrA)
}

async function getById(req,res) {
    let a=await AppartmentCleanModule.findById(req.params.id)
    res.status(200).send(a)
}

async function create(req,res) {
    let a=await new AppartmentCleanModule(req.body)
    await a.save()
    res.status(200).send(a)
}

async function deleteById(req,res){
    let a=await AppartmentCleanModule.findByIdAndDelete(req.params.id)
    res.status(200).send(a)
}

async function update(req,res) {
    let a=await AppartmentCleanModule.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).send(a)
}
async function getByIdWithCleaner(req,res) {
    let a=await AppartmentCleanModule.findById(req.params.id).populate('cleanerId')
    res.status(200).send(a) 
}
async function getAllWithCleaner(req,res) {
    let a=await AppartmentCleanModule.find().populate('AppartmentId')
    res.status(200).send(a) 
}
async function getByCleanerId(req,res) {
    let a=await AppartmentCleanModule.find({cleanerId:req.params.cleanerId})
    res.status(200).send(a)

}
async function getByAppartmentId(req,res) {
    let a=await AppartmentCleanModule.find({AppartmentId:req.params.AppartmentId})
    res.status(200).send(a)
}
module.exports={ getAll,getById,create,deleteById,update,getByIdWithCleaner,getAllWithCleaner,getByCleanerId,getByAppartmentId} 