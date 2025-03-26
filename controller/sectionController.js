import { sectionModel } from "../model/model.js"

const addSection = async (req, res) => {
    const {section} = req.body
    try {
        const sections = await sectionModel.findOne({section})
        if(sections){
            return res.status(400).json("Section already exist")
        }
        const newSection = new sectionModel({section})
        newSection.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const editSection = async (req, res) => {
    const {_id} = req.params
    const {section} = req.body
    try {
        const sections = await sectionModel.findOne({_id})
        const edited = await sectionModel.findOne({section: section})
        if(!sections){
            return res.status(404).json("Section not found")
        }

        if(edited && sections.section !== section){
            return res.status(400).json("Section already exist")
        }

        const edit = await sectionModel.updateOne({_id}, {$set: {section}})
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const deleteSection = async (req, res) => {
    const {_id} = req.params
    try {
        const sections = await sectionModel.findOne({_id})
        if(!sections){
            return res.status(404).json("Section not found")
        }
        const deleted = await sectionModel.deleteOne({_id})
        if(deleted.deletedCount === 0){
            return
        }else {
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const getSections = async (req, res) => {
    try {
        const allSections = await sectionModel.find()
        res.status(200).json(allSections)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

export default {addSection, editSection, deleteSection, getSections}