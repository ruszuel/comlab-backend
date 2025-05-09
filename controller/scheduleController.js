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
    const {event_id, title, start, end, teacher_name, subject, course, section, subtitle, comlab, comlab_id} = req.body
    const startObj = new Date(start);
    const endObj = new Date(end)
    const schedules = await schedule.find({comlab_id})
    try {
        const isConflicted = schedules.some((s) => {
            const storedStart = new Date(s.start).getTime();
            const storedEnd = new Date(s.end).getTime();
            const newStart = startObj.getTime();
            const newEnd = endObj.getTime();
            
            return newStart < storedEnd && newEnd > storedStart;
        })
        if(isConflicted){
            return res.status(400).json("Conflict on schedule detected!")
        }
        const newSched = new schedule({event_id, title, start, end, teacher_name, subject, course, section, subtitle, comlab, comlab_id})
        newSched.save()
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

const editSched = async (req, res) => {
    const {event_id, title, start, end, teacher_name, subject, course, section, subtitle, comlab, comlab_id} = req.body;
    const startObj = new Date(start);
    const endObj = new Date(end);
    
    try {
        const event = await schedule.findOne({event_id});
        const allSchedules = await schedule.find({comlab_id}); 
        
        if(!event){
            return res.sendStatus(404);
        }

        if(!allSchedules || allSchedules.length === 0){
            return res.sendStatus(404);
        }

        const isConflicted = allSchedules.some((s) => {
            const storedStart = new Date(s.start).getTime();
            const storedEnd = new Date(s.end).getTime();
            const newStart = startObj.getTime();
            const newEnd = endObj.getTime();
            
            return s.event_id !== event_id && newStart < storedEnd && newEnd > storedStart;
        });

        if(isConflicted){
            return res.status(400).json({message: "Conflict on schedule detected!"});
        }

        const update = await schedule.updateOne(
            {event_id},
            {$set: {title, start, end, teacher_name, subject, course, section, subtitle, comlab}}
        );
        
        if(update.modifiedCount === 0){
            return res.status(400).json({message: "No changes made"});
        }
        
        return res.sendStatus(200);
    } catch (error) {
        console.error("Error in editSched:", error);
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
};

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