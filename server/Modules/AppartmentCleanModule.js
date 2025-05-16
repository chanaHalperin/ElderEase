const mongoose = require("mongoose")
const { DayInWeek } = require("../Constants/enums") // נייבא את המערך של הימים מחוץ למודול
const ApartmentCleanModule=mongoose.Schema({
    AppartmentId: { type: mongoose.Schema.Types.ObjectId,ref:'appartment', required: true }, // מזהה דירה חובה
    cleanerId: { type: mongoose.Schema.Types.ObjectId,ref:'cleaner', required: true }, // מזהה מנקה חובה
    Day: { 
        type:String, // יום בשבוע
        enum: Object.values(DayInWeek), // מגביל את הערכים לאלה המוגדרים ב-enum
        required: true, // יום בשבוע חובה
    },
    StartTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }, // שעה בפורמט HH:MM
    EndTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }, // שעה בפורמט HH:MM
    Comments: { type: String, trim: true, maxlength: 300, default: "" } // הערות (עד 300 תווים, ברירת מחדל ריק)
});
module.exports = mongoose.model("apartmentClean",ApartmentCleanModule)