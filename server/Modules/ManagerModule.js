const mongoose = require("mongoose")
const ManagerModule=mongoose.Schema({
    RefId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true  }, // מזהה ייחודי חובה
    QueueElderlyToSignIn: { 
        type: [{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
        default: []
    } 
})
module.exports = mongoose.model("manager",ManagerModule)