const UserModule = require("../Modules/UserModule");
const bcrypt = require('bcrypt');

async function getAll(req, res) {
    let arrM = await UserModule.find();
    res.status(200).send(arrM);
}

async function getById(req, res) {
    let m = await UserModule.findById(req.params.id);
    res.status(200).send(m);
}

async function getByIdWithPopulate(req, res) {
    console.log("ID received:", req.params.id);

    let u = await UserModule.findById(req.params.id).populate("RefId");
    if (!u) 
      return res.status(404).send('User not found');
    console.log("getByIdWithPopulate:", u);
    res.status(200).send(u);
}
async function getByPassword(req, res){
   const Password = req.params.password;
   try {
      const user = await UserModule.findOne({ Password });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      console.error('Error finding user by password:', error);
      res.status(500).send('Server error');
    }
  };
  async function getByIdNumber(req, res) {
    const { Id, password } = req.body; // קבלת ה-ID והסיסמה מה-body
    try {
        const user = await UserModule.findOne({ Id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log("this. password: "+password)
        console.log("user. password: "+user.Password)
        // השוואת הסיסמה שסופקה לסיסמה המוצפנת
        const isMatch = await bcrypt.compare(password, user.Password);
        
        if (!isMatch) {
            return res.status(401).send('Invalid password'+",  this. password:"+password+",  user. password:"+user.Password);
        }
        // אם הכל תקין, החזר את פרטי המשתמש (ללא הסיסמה)
        const { Password, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword).send();
    } catch (error) {
        console.error('Error finding user by Id and password:', error);
        res.status(500).send('Server error');
    }
}

async function create(req, res) {
    try {
        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);

        // יצירת אובייקט המשתמש עם הסיסמה המוצפנת
        const userData = { ...req.body, Password: hashedPassword };
        const m = new UserModule(userData);

        // שמירת המשתמש במסד הנתונים
        await m.save();

        console.log("User created successfully");
        res.status(200).send(m);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send({ message: err.message });
        } else if (err.name === "ValidationError") {
            res.status(400).send({ message: err.message, errors: err.errors });
        } else {
            res.status(500).send({ message: err.message, error: err });
        }
    }
}

async function deleteById(req, res) {
    let m = await UserModule.findByIdAndDelete(req.params.id);
    res.status(200).send(m);
}

async function update(req, res) {
    let m = await UserModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(m);
}
// פונקציה לוגית לעדכון שדה הרפרנס והסטטוס בלבד
const {UserStatus}=require("../Constants/enums")
async function updateUserReference(userId, RefId) {
    return await UserModule.findByIdAndUpdate(RefId, 
        { RefId: userId ,Status:UserStatus.ACTIVE}, { new: true });
}
// פונקציה לוגית לעדכון שדה הסטטוס בלבד
async function updateUserStatusFromLocal(userId, status) {
    console.log("this is userId: " + userId+ " now this is status: " + status);
    return await UserModule.findByIdAndUpdate(userId,
        { Status: status }, { new: true });
}
module.exports = {updateUserStatusFromLocal, getAll,getByIdWithPopulate, getById, create, deleteById, update,updateUserReference,getByPassword,getByIdNumber };
