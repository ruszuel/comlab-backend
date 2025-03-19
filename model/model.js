import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    student_id: Number,
    firstname: String,
    lastname: String,
    course: String,
    section: String,
})

const teacherSchema = mongoose.Schema({
    teacher_id: Number,
    firstname: String,
    lastname: String,
    courses: [String],
    sections: [String],
})

export const studentModel = mongoose.model("students", studentSchema);
export const teacherModel = mongoose.model("teachers", teacherSchema);





