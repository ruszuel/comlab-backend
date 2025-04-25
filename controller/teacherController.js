import {teacherAttendance, teacherModel} from '../model/model.js'
import dotenv from 'dotenv';
import bcrytp from 'bcrypt'
import nodemailer from 'nodemailer'
import QRcode from 'qrcode'
import { randomUUID } from 'crypto';
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

const getFaculty = async(req, res) => {
    try{
        const teachers = await teacherModel.find();
        res.status(200).json(teachers)
    }catch(err){
        console.log(err);
    }
}

const addFaculty = async (req, res) => {
    const {teacher_id, firstname, lastname, courses, sections, teacher_email, subjects, password} = req.body
    try {
        const isExisting = await teacherModel.findOne({teacher_id})
        const isUsed = await teacherModel.findOne({teacher_email})
        if(isExisting){
            return res.sendStatus(403)
        }
        // const pass = Math.floor(1000 + Math.random() * 9000);
        if(isUsed){
            return res.status(406).send("Email already in use")
        }
        const hashedPassed = await bcrytp.hash(password, 10);

        const newFaculty = new teacherModel({teacher_id, firstname, lastname, courses, sections, teacher_email, password: hashedPassed, subjects})
        await newFaculty.save();
        await sendFacultyQr({teacher_id, teacher_email, password})
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

const deleteFaculty = async (req, res) => {
    const {teacher_id} = req.params
    try{
        const delTeacher = await teacherModel.deleteOne({teacher_id});
        if(delTeacher.deletedCount === 0){
            return res.sendStatus(404);
        }

        res.sendStatus(200);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const getSpecificId = async (req, res) => {
    const { teacher_id } = req.params; 
    try {
        const teacher = await teacherModel.findOne({ teacher_id });  
        if (!teacher) {
            return res.sendStatus(404);
        }

        res.status(200).json({isSuccess: true, teacher}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message }); 
    }
}

const sendFacultyQr = async ({teacher_id, teacher_email, password}) => { //gumagana
    // const {teacher_id, teacher_email, password} = req.body
    try{
        const path = `/tmp/${teacher_id}.png`
        await QRcode.toFile(path, teacher_id, {scale: 10});

        const mailOptions = {
            from: email,
            to: teacher_email,
            subject: "Save your QR Code",
            attachments: [
                {
                    filename: `${teacher_id}.png`,
                    path: path,
                    cid: "qrcode",
                }
            ],
            html: `<p>Scan the QR Code below:</p><img src="cid:qrcode"/><p>Your login credentials are: </p><p>ID: ${teacher_id} password: ${password}</p>`
        }

        transporter.sendMail(mailOptions, (err) => {
            if(err) {
                // res.status(500).send("Error sending mail: " + err.toString())
                // return
                throw err
            }
            // res.status(200).send('Email has been sent');
        })
    }catch(err){
        console.log(err)
        // res.status(500).send(err);
    }
}

const facultyLogIn = async (req, res) => {// gumagana
    const {teacher_id, password} = req.body
    try {
        const isRegister = await teacherModel.find({teacher_id})

        if(isRegister.length === 0){
            return res.status(404).json("Teacher not found");
        }

        if(await bcrytp.compare(password, isRegister[0].password)){
            return res.status(200).json(isRegister);
        }
        
        return res.sendStatus(403);
    } catch (error) {
        return res.status(500).send(error)
    }
}

const addTeacherAttendance = async (req, res) => { // when start class is clicked, GUMAGANA
    const {teacher_id, time_in, subject, course, section, unique, comlab} = req.body
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DD');
    // const unique = randomUUID().replace(/-/g, '').slice(0, 5);

    console.log(unique.toLocaleUpperCase())
    try{
        const teacher = await teacherModel.find({teacher_id});
        if(teacher.length === 0){
            return res.status(404).send("teacher doesn't exist");
        }
        const teacherName = teacher[0].lastname + " " + teacher[0].firstname;
        const course_section = course+"-"+section;
        const newTeacher = new teacherAttendance({teacher_id, teacher_name: teacherName, time_in, time_out: null, course_section, subject, date: philippineTimeFull, unique, comlab});
        newTeacher.save();
        return res.sendStatus(200);
    }catch(error){
        return res.sendStatus(500);
    }
}

const updateTeacherAttendance = async (req, res) => { //when end class is clicked
    const {unique, time_out} = req.body
    try {
        const teacher = await teacherAttendance.find({unique})
        if(teacher.length === 0){
            return res.sendStatus(404);
        }

        if(teacher[0].time_in !== null && teacher[0].time_out !== null){
            return res.sendStatus(403);
        }

        if(teacher[0].time_in !== null && teacher[0].time_out === null){
            const update = await teacherAttendance.updateOne({"unique": unique}, {$set: {time_out}})
            if(update.modifiedCount === 0){
                return res.sendStatus(404)
            }
        }
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const editTeacher = async (req, res) => {
    const {teacher_id, firstname, lastname, teacher_email, courses, sections, subjects} =  req.body
    try {
        const teacher = await teacherModel.findOne({teacher_id});
        const isEmailExist = await teacherModel.findOne({teacher_email})
        if(!teacher){
            return res.sendStatus(404);
        }

        if(isEmailExist && isEmailExist.teacher_id !== teacher_id){
            return res.status(406).send("Email already in use");
        }

        const updating = await teacherModel.updateOne({teacher_id}, {$set:{teacher_id, firstname, lastname, courses, sections, teacher_email, subjects}})
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

const getTeacherAttendance = async(req, res) => {
    try{
        const teachers = await teacherAttendance.find();
        res.status(200).json(teachers)
    }catch(err){
        console.log(err);
    }
}

const adminLog = async(req, res) => {
    const {user, pass} = req.body
    try {
        if(user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS){
            return sendStatus(200)
        }else{
            return res.sendStatus(401)
        }
    } catch (error) {
        return res.sendStatus(500)
    }
}

export default {getTeacherAttendance, addFaculty, getFaculty, deleteFaculty, getSpecificId, sendFacultyQr,
    facultyLogIn, addTeacherAttendance, updateTeacherAttendance, editTeacher, adminLog}