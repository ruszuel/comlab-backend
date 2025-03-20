import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    student_id: String,
    firstname: String,
    lastname: String,
    email: String,
    course: String,
    section: String,
})

const teacherSchema = mongoose.Schema({
    teacher_id: String,
    firstname: String,
    lastname: String,
    courses: [String],
    sections: [String],
})

const computerSchema = mongoose.Schema({
    name: String,
    room: String
})

const computerStatSchema = mongoose.Schema({
    name: String,
    room: String,
    computerSet: String,
    condition: String,
    status: String,
})

const attendanceSchema = mongoose.Schema({
    student_id: String,
    subject: String,
    teacher_id: String,
    date: String,
    time_in: String,
    time_out: String,
    status: String,
})

export const studentModel = mongoose.model("students", studentSchema);
export const teacherModel = mongoose.model("teachers", teacherSchema);
export const computer = mongoose.model("computers", computerSchema);
export const computerStats = mongoose.model("computer_stats", computerStatSchema);
export const studentAttendance = mongoose.model("attendances", attendanceSchema);





