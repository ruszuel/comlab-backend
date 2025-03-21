import {studentModel, teacherModel, records} from "../model/model.js";
import { studentAttendance } from "../model/model.js";
import nodemailer from 'nodemailer';
import QRcode from 'qrcode'
import dotenv from 'dotenv';
import moment from 'moment-timezone';

dotenv.config()
const email = process.env.EMAIL;
const pass = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: pass,
    },
    secure: true
})

const addStudent = async (req, res) => {
    const {student_id, firstname, lastname, course, section, email} = req.body
    try {
        const isExisting = await studentModel.findOne({student_id})

        if(isExisting){
            return res.sendStatus(403);
        }

        const newStudent = new studentModel({student_id, firstname, lastname, email, course, section})
        await newStudent.save();
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const deleteStudent = async (req, res) => {
    const {student_id} = req.params
    try{
        const delStud = await studentModel.deleteOne({student_id});
        if(delStud.deletedCount === 0){
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}


const sendQr = async (req, res) => {
    const {student_id, student_email} = req.body
    try{
        const path = `/tmp/${student_id}.png`
        await QRcode.toFile(path, student_id, {scale: 10});

        const mailOptions = {
            from: email,
            to: student_email,
            subject: "Save your QR Code",
            attachments: [
                {
                    filename: `${student_id}.png`,
                    path: path,
                    cid: "qrcode",
                }
            ],
            html: '<p>Scan the QR Code below:</p><img src="cid:qrcode"/>',
        }

        transporter.sendMail(mailOptions, (err) => {
            if(err) {
                res.status(500).send("Error sending mail: " + err.toString())
                return
            }
            res.status(200).send('Email has been send');
        })
    }catch(err){
        res.status(500).send(err);
    }
}

const addToClass = async(req, res) => {
    const {teacher_id, course, section} = req.body
    const now = new Date();
    const date = now.toISOString().split('T')[0]
    try {
        const isExist = await teacherModel.findOne({teacher_id});
        if(!isExist){
            return res.sendStatus(403) //forbid not existing teacher
        }

        const students = await studentModel.find({ course, section});
        if(students.length === 0){
            return res.sendStatus(404);
        }

        const attendanceEntries = students.map(student => ({
            student_id: student.student_id,
            teacher_id,
            course_section: `${student.course}-${student.section}`,
            date,
            time_in: null,
            time_out: null,
            status: "Absent",
        }));

        await studentAttendance.insertMany(attendanceEntries);
        return res.status(200).json({ message: "Attendance added successfully" });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const updateAttendance = async (req, res) => {
    const {student_id, in_time, out_time} = req.body
    let status = "Late";
    const philippineTime = moment().tz('Asia/Manila');
    const time = philippineTime.format('HH:mm');
    try {
        const inClass = await studentAttendance.find({student_id});
        if(inClass.length === 0){
            return res.status(404).json("Student not found!");
        }

        if(inClass[0].time_in !== null && inClass[0].time_out === null){
            const out = time;
            const formattedTime = moment(out, 'HH:mm');
            const formattedOuTime = moment(out_time, 'HH:mm')

            if(formattedTime.isBefore(formattedOuTime)){
                return res.status(402).send("Class are not done yet")
            }
            console.log(formattedTime.isBefore(formattedOuTime))
            const upadatedTimeOut = await studentAttendance.updateOne({"student_id": student_id}, {$set: {time_out: out}})

            if(upadatedTimeOut.modifiedCount === 0){
                return res.sendStatus(404)
            }
            return res.sendStatus(200)
        }

        if(inClass[0].time_in === null){
            const formattedTimeIn = moment(time, 'HH:mm')
            const formattedInTime = moment(in_time, 'HH:mm');
            const gracePeriod = formattedInTime.clone().add(15, 'minutes');
            const considerAbsent = formattedInTime.clone().add(40, 'minutes');
            if(formattedTimeIn.isBefore(gracePeriod)){
                status = "Present"
            }

            if(inClass[0].time_in === null && formattedTimeIn.isAfter(considerAbsent)){
                return res.status(403).send("You cannot enter this class now");
            }

            const updateTimeIn = await studentAttendance.updateOne({"student_id": student_id}, {$set: {time_in: time, status}})
            if(updateTimeIn.modifiedCount === 0){
                return res.status(405).json("Failed to Update in-time")
            }else{
                return res.sendStatus(200);
            }
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

const addToAttendance = async (req, res) => {
    const {student_id, teacher_id, course, section, in_time, out_time} = req.body
    let status;
    const philippineTime = moment().tz('Asia/Manila');
    const time = philippineTime.format('HH:mm');
    try {
        const now = new Date()
        const isExist = await studentModel.findOne({student_id})
        const existInAttendance = await studentAttendance.findOne({student_id});

        if(existInAttendance){
            const attRow = await studentAttendance.find({"student_id": student_id})
            console.log(attRow)
            if(attRow[0].time_in !== null && attRow[0].time_out === null){
                const out = time;
                const formattedTime = moment(out, 'HH:mm');
                const formattedOuTime = moment(out_time, 'HH:mm')

                if(formattedTime.isBefore(formattedOuTime)){
                    return res.status(402).send("Class are not done yet")
                }
                console.log(formattedTime.isBefore(formattedOuTime))
                const upadatedTimeOut = await studentAttendance.updateOne({"student_id": student_id}, {$set: {time_out: out}})

                if(upadatedTimeOut.modifiedCount === 0){
                    return res.sendStatus(404)
                }
                return res.sendStatus(200)
            }else{
                return res.sendStatus(501)
            }
        }

        if(!isExist){
            return res.sendStatus(403);
        }

        const rows = await studentModel.find({"student_id": student_id});
        if((rows[0].course === course) && (rows[0].section === section)){
            const course_section = rows[0].course + "-" +rows[0].section
            const date = now.toISOString().split('T')[0]
            const time_in = time
            const formattedTimeIn = moment(time_in, 'HH:mm');
            const formattedInTime = moment(in_time, 'HH:mm');
            const gracePeriod = formattedInTime.clone().add(15, 'minutes');
            status = "Late"
            if(formattedTimeIn.isBefore(gracePeriod)){
                status = "Present"
            }
            console.log(course_section)
            const addToAttendance = new studentAttendance({student_id, teacher_id, course_section, date, time_in, time_out: null, status})
            const savedAttendance =  await addToAttendance.save();
            console.log(savedAttendance)
            return res.sendStatus(201);
        }else{
            return res.sendStatus(403);
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

const getAttendance = async (req, res) => {
    try{
        const attendance = await studentAttendance.find();
        res.status(200).json(attendance);
    }catch(error){
        console.log(error)
        res.sendStatus(500);
    }
}

const deleteAllStudentAttendance = async (req, res) => {
    try {
        const delStud = await studentAttendance.deleteMany(); 
        if (delStud.deletedCount === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        res.status(200).json({ message: "All attendance deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const addToAllAttendance = async (req, res) => {
    try {
        const current = await studentAttendance.find()
        console.log("Fetched Attendance Records:", current);
        if (current.length > 0) {
            await records.insertMany(current);
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        res.sendStatus(500)
    }
}

export default {addStudent, deleteStudent, sendQr, addToAttendance, getAttendance, deleteAllStudentAttendance, addToClass, updateAttendance, addToAllAttendance}