import { semesterModel } from "../model/model.js"
import moment from "moment-timezone";

// Helper function to check date conflicts
const checkDateConflict = async (start, end, excludeId = null) => {
    const newStart = new Date(start);
    const newEnd = new Date(end);
    
    // Find all semesters that might conflict
    const query = {
        $or: [
            { start: { $gte: start, $lte: end } },
            { end: { $gte: start, $lte: end } },
            { $and: [{ start: { $lte: start } }, { end: { $gte: end } }] },
            { $and: [{ start: { $gte: start } }, { end: { $lte: end } }] }
        ]
    };
    
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    
    const conflictingSemesters = await semesterModel.find(query);

    if (conflictingSemesters.length > 0) {
        const conflicts = conflictingSemesters.map(sem => ({
            semester_type: sem.semester_type,
            school_year: sem.school_year,
            start: sem.start,
            end: sem.end
        }));
        return conflicts;
    }
    
    return null;
};

const addSemester = async (req, res) => {
    const { semester_type, school_year, start, end, status } = req.body;

    try {
        // Check for date conflicts
        const conflicts = await checkDateConflict(start, end);
        const statusConflict = await semesterModel.findOne({status: "Ongoing"})
        const sy = await semesterModel.find({school_year});

        console.log(sy)
        
        if (conflicts) {
            return res.status(400).json({
                error: "Date conflict with existing semester(s)",
                conflicts
            });
        }
        
        if(sy !== null) {
            for(const year of sy){
                if(year.school_year === school_year && year.semester_type === semester_type){
                    return res.status(405).send("semester already exist")
                }
            }
        }
        
        const newSemester = new semesterModel({ 
            semester_type, 
            school_year, 
            start, 
            end, 
            status 
        });
        await newSemester.save();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error: " + error);
    }
};

const editSemester = async (req, res) => {
    const { _id } = req.params;
    const { semester_type, school_year, start, end, status } = req.body;
    
    try {
        // Check for date conflicts, excluding the current semester we're editing
        const conflicts = await checkDateConflict(start, end, _id);
        
        if (conflicts) {
            return res.status(400).json({
                error: "Date conflict with existing semester(s)",
                conflicts
            });
        }
        
        await semesterModel.updateOne(
            { _id },
            { $set: { semester_type, school_year, start, end, status } }
        );
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json("Server error: " + error);
    }
};

// The rest of your functions remain the same
const deleteSemester = async (req, res) => {
    const {_id} = req.params
    try {
        const semester = await semesterModel.findOne({_id})
        if(!semester){
            return res.status(404).json("Semester not found")
        }
        const deleted = await semesterModel.deleteOne({_id})
        if(deleted.deletedCount === 0){
            return
        }else {
            return res.sendStatus(200)
        }
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const getSemester = async (req, res) => {
    try {
        const allSemester = await semesterModel.find()
        res.status(200).json(allSemester)
    } catch (error) {
        return res.status(500).json("Server error" + error)
    }
}

const updateStatus = async (req, res) => {
    const currentDate = moment().tz('Asia/Manila');

    try {
        const semesters = await semesterModel.find();

        for (const semester of semesters) {
            const start = moment(new Date(semester.start)).tz('Asia/Manila');
            const end = moment(new Date(semester.end)).tz('Asia/Manila');

            let newStatus;
            if (currentDate.isAfter(end)) {
                newStatus = "Finished";
            } else if (currentDate.isBefore(start)) {
                newStatus = "Upcoming";
            } else {
                newStatus = "Ongoing";
            }

            if (semester.status !== newStatus) {
                await semesterModel.updateOne(
                    { _id: semester._id },
                    { $set: { status: newStatus } }
                );
            }
        }

        // Fetch the updated data
        const updatedSemesters = await semesterModel.find();
        return res.status(200).json(updatedSemesters);
    } catch (error) {
        return res.status(500).json("Server error: " + error.message);
    }
}

export default {addSemester, editSemester, deleteSemester, getSemester, updateStatus}