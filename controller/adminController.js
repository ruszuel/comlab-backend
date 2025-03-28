import { adminModel } from "../model/model.js";
import bcrypt from 'bcrypt'

const addAdmin = async (req, res) => {
    const {id, name, pass} = req.body
    try {
        const admins = await adminModel.findOne({id})
        const hashedPassed = await bcrypt.hash(pass, 10);
        if(admins){
            return res.status(400).json("admin already exist")
        }
        const newAdmin = new adminModel({id, name, password: hashedPassed})
        newAdmin.save()
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const editAdmin = async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    try {
        const admins = await adminModel.findOne({id})
        if(!admins) {
            return res.sendStatus(404)
        }

        await adminModel.updateOne({id}, {$set:{id, name}})
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const deleteAdmin = async (req, res) => {
    const {_id} = req.params
    try {
        const admins = await adminModel.findOne({_id})
        if(!admins){
            return res.sendStatus(404)
        }
        await adminModel.deleteOne({_id})
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find()
        return res.status(200).json(admins)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const adminLog = async (req, res) => {
    const {id, password} = req.body
    try {
        const admins = await adminModel.findOne({id})
        if(!admins) {
            return res.sendStatus(404)
        }

        if(await bcrypt.compare(password, admins.password)){
            return res.sendStatus(200)
        }
        return res.sendStatus(403);
    } catch (error) {
        return res.sendStatus(500)
    }
}

export default {addAdmin, editAdmin, deleteAdmin, getAdmins, adminLog}