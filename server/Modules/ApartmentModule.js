const mongoose = require("mongoose")
const {ApartmentStatus}=require("../Constants/enums")
const ApartmentModule=new mongoose.Schema({
    Id: { type: Number, required: true, unique: true }, // מזהה ייחודי חובה
    RefId: { type: mongoose.Schema.Types.ObjectId, ref: "elderly", default:null }, // מזהה ייחודי חובה
    Floor: { type: Number, required: true, min: -4 }, // מספר קומה (לא שלילי)
    NumOfRooms: { type: Number, default: 1, min: 1, max: 5 }, // מספר חדרים (בין 1 ל-10)
    IsView: { type: Boolean, default: false }, // האם יש נוף
    MonthlyPrice: { type: Number, required: true, min: 0 }, // מחיר חודשי (לא שלילי)
    SizeInSquareMeters: { type: Number, required: true, min: 10 }, // גודל הדירה (לפחות 10 מ"ר)
    ElderlyId: { type: mongoose.Schema.Types.ObjectId, ref: "elderly" }, // מזהה הקשיש
    Status: { type: String, enum: Object.values(ApartmentStatus), default: ApartmentStatus.AVAILABLE }, // סטטוס מוגבל לערכים מסוימים
    ApartmentPlan:{ type: String, default: null }, // תכנית הדירה (אם יש)
    Images: { type: [String], default: null }, // תמונה של הדירה
})
module.exports = mongoose.model("apartment",ApartmentModule)