const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/studentsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const StudentSchema = new mongoose.Schema({
    rollNo: String,
    name: String,
    email: String,
    address: String,
    mobile: String,
    parentName: String,
    parentNumber: String,
    hscPercentage: Number,
    cgpa: Number,
    leetcodeId: String,
    githubId: String
});
const Student = mongoose.model("Student", StudentSchema);
app.get("/students", async (req, res) => res.json(await Student.find()));
app.post("/students", async (req, res) => res.json(await new Student(req.body).save()));
app.put("/students/:id", async (req, res) => res.json(await Student.findByIdAndUpdate(req.params.id, req.body)));
app.delete("/students/:id", async (req, res) => res.json(await Student.findByIdAndDelete(req.params.id)));
app.listen(8080, () => console.log("Server running on port 8080"));