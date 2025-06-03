const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
const cors = require('cors');
const path = require('path');
const upload = require('./aploadHandler.js');
const PORT = process.env.PORT || 8080
const ActivityRouter = require("./Routers/ActivityRouter")
const ApartmentRouter = require("./Routers/ApartmentRouter")
const ApartmentCleanRouter = require("./Routers/ApartmentCleanRouter")
const CleanerRouter = require("./Routers/CleanerRouter")
const ElderlyRouter = require("./Routers/ElderlyRouter")
const ManagerRouter = require("./Routers/ManagerRouter")
const UserRouter = require("./Routers/UserRouter")
const EnumsRouter = require("./Routers/EnumsRouter")
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { sendEmail } = require("./SendEmail.js")
const dbPass = process.env.DB_PASS;
const { runScheduler } = require("./runScheduler.js")
const { createToken } = require("./auth.js")
mongoose.connect(dbPass)
  .then(() => console.log("Connected…")).catch(err => console.log(err))

app.use(express.json());

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use("/Activity", ActivityRouter)
app.use("/Apartment", ApartmentRouter)
app.use("/ApartmentClean", ApartmentCleanRouter)
app.use("/Cleaner", CleanerRouter)
app.use("/Elderly", ElderlyRouter)
app.use("/Manager", ManagerRouter)
app.use("/User", UserRouter)
app.use("/Enums", EnumsRouter)
app.post("/api/createToken", createToken);

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) 
    return res.status(400).json({ error: 'Missing fields' });
  try {
    const info = await sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/upload', upload.array('file'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const uploadedFile = req.files[0]; // ✅ הגדרה לפני שימוש

  res.json({
    name: uploadedFile.filename, // ✅ זה מה שהקומפוננטה שלך מחפשת
    url: `http://localhost:${PORT}/uploads/${uploadedFile.filename}`
  });
});


app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await runScheduler();
    res.json(schedule);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.listen(PORT, () => {
  console.log("run...");
})