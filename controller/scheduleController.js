import { schedule } from "../model/model.js"

const getAllSchedules = async (req, res) => {
    try {
        const allSched = await schedule.find()
        return res.status(200).json(allSched)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const addSchedules = async (req, res) => {
    const {event_id, title, start, end, teacher_name, subject, course, section, subtitle, comlab} = req.body
    const startObj = new Date(start);
    const endObj = new Date(end)
    const schedules = await schedule.find()
    try {
        const isConflicted = schedules.some((s) => {
            const storedStart = new Date(s.start);
            const storedEnd = new Date(s.end);
            if (startObj.getTime() === storedStart.getTime()||
            (startObj.getTime() > storedStart.getTime() && startObj.getTime() < storedEnd.getTime())) {
                return true;
            }
            if (endObj.getTime() > storedStart.getTime() && endObj.getTime() <= storedEnd.getTime()) {
                return true;
            }
            if (startObj.getTime() > storedStart.getTime() && startObj.getTime() < storedEnd.getTime()) {
                return true;
            }
            return false;
        })
        if(isConflicted){
            return res.status(400).json("Conflict on schedule detected!")
        }
        const newSched = new schedule({event_id, title, start, end, teacher_name, subject, course, section, subtitle, comlab})
        newSched.save()
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

const editSched = async (req, res) => {
    const {event_id, title, start, end, teacher_name, subject, course, section, subtitle, comlab} = req.body
    try {
        const event = await schedule.findOne({event_id})
        if(!event){
            return sendStatus(404)
        }
        const update = await schedule.updateOne({event_id},{$set: {title, start, end, teacher_name, subject, course, section, subtitle, comlab}})
        if(update.modifiedCount === 0){
            return;
        }else{
            return sendStatus(200)
        }
    } catch (error) {
        return sendStatus(500)
    }
}

const deleteSched = async (req, res) => {
    const {event_id} = req.params
    try{
        const delSched = await schedule.deleteOne({event_id});
        if(delSched.deletedCount === 0){
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json({ message: "Schedule deleted successfully" });
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}

export default {addSchedules, deleteSched, getAllSchedules, editSched}