import {studentModel} from "../model/model.js";
import { studentAttendance } from "../model/model.js";
import nodemailer from 'nodemailer';
import QRcode from 'qrcode'
import dotenv from 'dotenv';

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
        const path = `./QR/${student_id}.png`
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

const addToAttendance = async (req, res) => {
    const {student_id, teacher_id, subject, course, section, teacher_in} = req.body
    let status;
    try {
        const now = new Date()
        const isExist = await studentModel.findOne({student_id})
        if(!isExist){
            return res.sendStatus(403); // pag wala sya sa student list
        }

        const rows = await studentModel.find({"student_id": student_id});
        if((rows[0].course === course) && (rows[0].section === section)){ //kapag equal yng section at course ng student sa course and section na sinet ni teacher
            const date = now.toISOString().split('T')[0]
            const time_in = now.toLocaleTimeString()
            status = "Late"
            const addToAttendance = new studentAttendance({student_id, subject, teacher_id, date, time_in, time_out: null, status})
            const savedAttendance =  await addToAttendance.save();
            console.log(savedAttendance)
            return res.sendStatus(200);
        }else{
            return res.sendStatus(403);
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

export default {addStudent, deleteStudent, sendQr, addToAttendance}