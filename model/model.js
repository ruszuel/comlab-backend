import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    student_id: Number,
    firstname: String,
    lastname: String,
    course: String,
    section: String,
})

const studentModel = mongoose.model("students", studentSchema);

export default studentModel;



