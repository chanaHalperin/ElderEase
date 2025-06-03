
const mongoose = require('mongoose');
const { DayInWeek } = require('../Constants/enums');

const apartmentCleanSchema = new mongoose.Schema({
  AppartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'apartment',
    required: true
  },
  cleanerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cleaner',
    required: true
  },
  Day: {
    type: String,
    enum: Object.values(DayInWeek),
    required: true
  },
  StartTime: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):[0-5]\d$/
  },
  EndTime: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):[0-5]\d$/
  },
  Comments: {
    type: String,
    trim: true,
    maxlength: 300,
    default: ""
  }
});

// הוספת אינדקס ייחודי על צירוף של דירה ויום
apartmentCleanSchema.index(
  { AppartmentId: 1, Day: 1 },
  { unique: true }
);
module.exports = mongoose.model('ApartmentClean', apartmentCleanSchema);
