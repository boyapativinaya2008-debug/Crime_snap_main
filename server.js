require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Atlas Connected"))
.catch(err => console.log(err));
const studentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  age: Number,
  marks: Number,
  grade: String,
},{
  versionKey: false
});

const Student = mongoose.model("Student", studentSchema);
// app.post("/addStudent", async (req, res) => {
//   try {
//     const data = req.body;
//     const newStudent = new Student(data);
//     await newStudent.save();
//     res.send("Student added successfully");
//   } catch (err) {
//     res.send(err.message);
//   }
// });
app.post("/addStudent", async (req, res) => {
  try {
    const lastStudent = await Student.findOne().sort({ id: -1 });

    const newId = lastStudent ? lastStudent.id + 1 : 1;

    const newStudent = new Student({
      id: newId,
      ...req.body
    });

    await newStudent.save();

    res.send("Student added successfully");
  } catch (err) {
    res.send(err.message);
  }
});
app.get("/getStudents", async (req, res) => {
  try {
    const students = await Student.find({}, { _id: 0, __v: 0 });
    res.json(students);
  } catch (err) {
    res.send(err.message);
  }
});
app.get("/", (req, res) => {
  res.send("This is Murari");
});

app.listen(process.env.PORT || 5001, () => {
  console.log("Server running on port "+process.env.PORT);
});
console.log("CHECK ENV:", process.env.MONGODB_URI);