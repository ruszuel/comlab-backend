import { schedule, teacherModel } from "../model/model.js"

// const addSchedule = async (req, res) => {
//     const {teacher_id, subject, room, date, start_time, end_time} = req.body
//     let schedule_id = randomUUID().replace(/-/g, '').slice(0, 5);
//     try {
//         const teacher = await teacherModel.findOne({teacher_id})
//         const scheduless = await schedule.findOne({schedule_id})
//         if(!teacher || scheduless){
//             return sendStatus(404);
//         }

//         if(schedule_id === scheduless.schedule_id){
//             schedule_id = randomUUID().replace(/-/g, '').slice(0, 5);
//         }

//         const teacher_name = teacher.firstname + " " + teacher.lastname
//         const addToSchedule = new schedule({schedule_id, teacher_id, teacher_name, subject, room, date, start_time, end_time})
//         addToSchedule.save();
//         res.sendStatus(200)
//     } catch (error) {
//         console.log(error)
//         return res.sendStatus(500)

//     }
// }

// const deleteSchedule = async (req, res) => {
//     const {schedule_id} =  req.params
//     try {
//         const schedules = await schedule.findOne({schedule_id})
//         if(!schedules){
//             return res.sendStatus(404)
//         }

//         const deleteSched = await schedule.deleteOne({schedule_id})
//         if(deleteSched.deletedCount === 0){
//             return res.sendStatus(304)
//         }else{
//             return res.sendStatus(200)
//         }

//     } catch (error) {
//         console.log(error)
//         return res.sendStatus(500)
//     }
// }

const getAllSchedules = async (req, res) => {
    try {
        const allSched = await schedule.find()
        return res.status(200).json(allSched)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const addSchedules = async (req, res) => {
    const {event_id, title, start, end, teacher_name, subject, course, section, subtitle} = req.body
    try {
        const newSched = new schedule({event_id, title, start, end, teacher_name, subject, course, section, subtitle})
        newSched.save()
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

const editSched = async (req, res) => {
    const {event_id, title, start, end, teacher_name, subject, course, section, subtitle} = req.body
    try {
        const event = await schedule.findOne({event_id})
        if(!event){
            return sendStatus(404)
        }
        const update = await schedule.updateOne({event_id},{$set: {title, start, end, teacher_name, subject, course, section, subtitle}})
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
    const {event_id} = req.body
    try {
        const del = await schedule.findOne({event_id})
        if(!del){
            return res.sendStatus(404)
        }

        const deleting = await schedule.deleteOne({event_id})
        if(deleting.deletedCount === 0){
            return
        }else{
            return sendStatus(200)
        }
    } catch (error) {
        return res.sendStatus(500)
    }
}

export default {addSchedules, deleteSched, getAllSchedules, editSched}