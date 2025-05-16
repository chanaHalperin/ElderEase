const mongoose = require("mongoose")
const {ActivityCategory} = require("../Constants/enums")
const ActivityModule=mongoose.Schema({
    Id: { type: Number, required: true, unique: true }, // מזהה ייחודי חובה
    Name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 }, // שם האירוע
    Category: { 
        type: String,
        enum: Object.values(ActivityCategory), // מגביל את הערכים לאלה המוגדרים ב-enum
        required: true
    },
    Date: { type: Date, required: true }, // תאריך האירוע
    Location: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 }, // מיקום האירוע
    participantsList: { type: [mongoose.Schema.Types.ObjectId], default: [],ref:'elderly' }, // רשימת משתתפים (שמות)
    MakerName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 }, // שם יוצר האירוע
    Price: { type: Number, default: 0, min: 0 }, // מחיר האירוע (לא יכול להיות שלילי)
    MaxParticipants: { type: Number, default: 50,min:50}, // מספר מקסימלי של משתתפים
    Image: { type: String, default: null }, // תמונה של האירוע
})
module.exports = mongoose.model("activity",ActivityModule)