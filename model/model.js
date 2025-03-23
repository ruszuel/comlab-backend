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
    teacher_email: String,
    password: String,
    subjects: [String],
})

const computerSchema = mongoose.Schema({
    name: String,
    room: String
})

const computerStatSchema = mongoose.Schema({
    pc_id: String,
    comlabid: String,
    name: String,
    condition: String,
    status: String,
    date_added: String,
    updated_at: String,
    comment: String,
})

const attendanceSchema = mongoose.Schema({
    student_id: String,
    teacher_id: String,
    course_section: String,
    date: String,
    time_in: String,
    time_out: String,
    status: String,
    teacher_name: String,
    subject: String,
})

const recordSchema = mongoose.Schema({
    student_id: String,
    teacher_id: String,
    course_section: String,
    date: String,
    time_in: String,
    time_out: String,
    status: String,
    teacher_name: String,
    subject: String,
})

const teacherAttendanceSchema = mongoose.Schema({
    teacher_id: String,
    teacher_name: String,
    time_in: String,
    time_out: String,
    course_section: String,
    subject: String,
    date: String,
    unique: String,
})

export const studentModel = mongoose.model("students", studentSchema);
export const teacherModel = mongoose.model("teachers", teacherSchema);
export const computer = mongoose.model("computers", computerSchema);
export const computerStats = mongoose.model("computer_stats", computerStatSchema);
export const studentAttendance = mongoose.model("attendances", attendanceSchema);
export const records = mongoose.model("attendance_records", recordSchema);
export const teacherAttendance = mongoose.model("teacher_attendances", teacherAttendanceSchema)




