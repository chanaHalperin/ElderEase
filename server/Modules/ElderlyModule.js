const mongoose = require("mongoose")
const {Gender,PersonalStatus,DayInWeek}=require("../Constants/enums")
const ElderlyModule=mongoose.Schema({
    RefId: { type: mongoose.Schema.ObjectId,ref:'user', required: true, unique: true }, // מזהה ייחודי חובה
    Gender: { type: String, enum: Object.values(Gender), required: true }, // מגדר מוגבל לערכים מסוימים
    PersonalStatus: { type: String, enum: Object.values(PersonalStatus), default: PersonalStatus.SINGLE }, // מצב משפחתי מוגבל
    DateOfBirth: { type: Date, required: true }, // תאריך לידה חובה
    RelativePhone: { type: String, required: true }, // טלפון קרוב משפחה באותו פורמט
    MedicalBag: { type: Number, required: true, min: 1 , match: [/^\S+@\S+\.\S+$/, "Invalid email format"] }, // חייב להיות מספר חיובי
    ApartmentId: { type: mongoose.Schema.Types.ObjectId,ref:'apartment', default: null}, // חייב להיות מספר חיובי
    ActivitiesList: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "activity" }], default: [] },
    HasPhilipin: { type: Boolean, required: true }, // האם יש מטפל פיליפיני חובה
    PreferredCleaningTime: {
       type: [ { 
        day: {
          type: String,
          enum: Object.values(DayInWeek),
          required: true},
        time: {
          type: String,
          required: true
        }}],
    default: []}}
   
)
module.exports = mongoose.model("elderly",ElderlyModule)