const mongoose = require("mongoose");
const {Roles} = require("../Constants/enums"); 
const {UserStatus}=require("../Constants/enums")

const userModule = new mongoose.Schema({
  RefId: { type: mongoose.Schema.Types.ObjectId,refPath:'Role',  default:null}, 
  Id: { type: String, required: true, unique: true,  minlength: 9, maxlength: 9 }, // מזהה ייחודי חובה
  Phone: { type: String, required: true, match: [/^\d{10}$/, "Invalid phone number format"] },
  FirstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 }, 
  LastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 }, 
  Email: {type: String,required: true,unique: true,lowercase: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] }, 
  Password: { type: String, required: true, minlength: 6,unique: true }, // סיסמה חובה
  Role: { type: String, enum: Object.values(Roles), required: true }, 
  Status:{type: String, enum: Object.values(UserStatus), default: UserStatus.GUEST}, // סטטוס מוגבל לערכים מסוימים}
  CreatedAt: { type: Date, default: Date.now,},
});

module.exports = mongoose.model("user", userModule);