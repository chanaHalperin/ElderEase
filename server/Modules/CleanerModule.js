const mongoose = require("mongoose")
const {DayInWeek} = require("../Constants/enums") // ייבוא של enum לימים בשבוע
const CleanerModule=mongoose.Schema({
    
    RefId:{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true  }, // מזהה ייחודי חובה
    dayInWork: { 
        type: [String], // יום בשבוע
        enum: Object.values(DayInWeek), // מגביל את הערכים לאלה המוגדרים ב-enum
        required: true 
    }
})
module.exports = mongoose.model("cleaner",CleanerModule)