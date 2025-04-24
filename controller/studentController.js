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
        const isEmailExist = await studentModel.findOne({email})

        if(isExisting){
            return res.sendStatus(403);
        }

        if(isEmailExist){
            return res.status(406).send("Email already in use")
        }

        const newStudent = new studentModel({student_id, firstname, lastname, email, course, section})
        await newStudent.save();
        await sendQr({student_id, student_email: email})
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


const sendQr = async ({student_id, student_email}) => {
    // const {student_id, student_email} = req.body
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
                // res.status(500).send("Error sending mail: " + err.toString())
                throw err
            }
            // res.status(200).send('Email has been send');
        })
    }catch(err){
        // res.status(500).send(err);
        throw err;
    }
}

const addToClass = async(req, res) => {
    const {teacher_id, course, section, subject} = req.body
    const now = new Date();
    const date = now.toISOString().split('T')[0]
    try {
        const isExist = await teacherModel.findOne({teacher_id});
        if(!isExist){
            return res.sendStatus(403) //forbid not existing teacher
        }
        console.log(isExist)
        const teacherName = isExist.lastname + ", " + isExist.firstname
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
            teacher_name: teacherName,
            subject,
            student_name: student.lastname + ", " + student.firstname
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
    const out = time;
    const formattedTime = moment(out, 'HH:mm');
    const formattedOuTime = moment(out_time, 'HH:mm')
    try {
        const inClass = await studentAttendance.find({student_id});
        if(inClass.length === 0){
            return res.status(404).json("Student not found!");
        }

        if(inClass[0].time_in === null && formattedTime.isSameOrAfter(formattedOuTime)){
            return res.sendStatus(406)
        }

        if(inClass[0].time_in !== null && inClass[0].time_out === null){ // check if time_in is not null and timeout null
            // const out = time;
            // const formattedTime = moment(out, 'HH:mm');
            // const formattedOuTime = moment(out_time, 'HH:mm')

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

        if(inClass[0].time_in === null){ // check if time in is null
            const formattedTimeIn = moment(time, 'HH:mm')
            const formattedInTime = moment(in_time, 'HH:mm');
            const gracePeriod = formattedInTime.clone().add(15, 'minutes');
            const considerAbsent = formattedInTime.clone().add(40, 'minutes');
            if(formattedTimeIn.isBefore(gracePeriod)){
                status = "Present"
            }

            if(inClass[0].time_in === null && formattedTimeIn.isAfter(considerAbsent)){ //chck if time in is null and if time in is after 40 mins
                return res.status(403).send("You cannot enter this class now");
            }

            const updateTimeIn = await studentAttendance.updateOne({"student_id": student_id}, {$set: {time_in: time, status}})
            if(updateTimeIn.modifiedCount === 0){
                return res.status(405).json("Failed to Update in-time")
            }else{
                return res.sendStatus(200);
            }
        }
        return res.sendStatus(405);
        
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
        await studentAttendance.deleteMany(); 
        res.status(200).json({ message: "All attendance deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const addToAllAttendance = async (req, res) => {
    try {
        const current = await studentAttendance.find()
        const updated = await studentAttendance.updateMany({"time_out": null}, {$set :{status: "Absent"}})
        const updatedCurrent = await studentAttendance.find()

        console.log("Fetched Attendance Records:", updatedCurrent);
        if (current.length > 0) {
            await records.insertMany(updatedCurrent);
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        res.sendStatus(500)
    }
}

const getTotalAttendance = async (req, res) => {
    try{
        const record = await records.find();
        res.status(200).json(record);
    }catch(error){
        console.log(error)
        res.sendStatus(500);
    }
}

const editStudent = async (req, res) => {
    const {student_id, firstname, lastname, email, course, section} =  req.body
    try {
        const student = await studentModel.findOne({student_id});
        if(!student){
            return res.sendStatus(404);
        }

        const updating = await studentModel.updateOne({student_id}, {$set:{student_id, firstname, lastname, email, course, section}})
        return res.sendStatus(200);

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

const editStatus = async (req, res) => {
    const { _id } = req.params;
    const { status } = req.body

    try {
        const updatedStatus = await records.findByIdAndUpdate(_id,{ status });
        if (!updatedStatus) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json({
            isSuccess: true,
            updatedStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occurred while updating the data.",
            error: error.message
        });
    }
}

export default {editStatus, addStudent, deleteStudent, sendQr, addToAttendance, getAttendance, deleteAllStudentAttendance,
    addToClass, updateAttendance, addToAllAttendance, getTotalAttendance, editStudent}