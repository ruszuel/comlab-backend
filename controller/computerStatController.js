import { computerStats } from "../model/model.js";
import moment from 'moment-timezone';

const getList = async(req, res) => {
  try {
    const com = await computerStats.find();
    res.status(200).json({
        isSuccess: true,
        com
    });
  } catch (err) {
      console.error(err);
      res.status(500).json({
          isSuccess: false,
          message: "An error occurred while fetching the data.",
          error: err.message
      });
  }
}

const addComputerSet = async (req, res) => {
    const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DD : hh:mm A');
    const {pc_id, comlabid, comlabname, name, condition, status} = req.body
    try {
        // const isExisting = await computerStats.findOne({name})
        // if(isExisting){
        //     return res.sendStatus(403)
        // }

        const newComputerSet = new computerStats({pc_id, comlabid, comlabname, name, condition, status, date_added: philippineTimeFull, updated_at: philippineTimeFull, comment: ""})
        await newComputerSet.save();
        res.status(200).json({
            isSuccess: true,
            newComputerSet
        });
    } catch (error) {
        console.error(err);
        res.status(500).json({
          isSuccess: false,
          message: "An error occurred while fetching the data.",
          error: err.message
      });
    }
}

const deleteComputerSet = async (req, res) => {
    const {_id} = req.params
    try{
        const delSet = await computerStats.deleteOne({_id});
        if(delSet.deletedCount === 0){
            return res.status(404).json({ message: "Computer Set not found" });
        }

        res.status(200).json({ message: "Computer set deleted successfully" });
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}

const editComputerSet = async (req, res) => {
    const { _id } = req.params;
    const { pc_id, comlabid, name, condition, status, comment } = req.body;
    const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DD : hh:mm A');

    try {
        const updatedComputerSet = await computerStats.findByIdAndUpdate(_id,{ pc_id, comlabid, name, condition, status, comment, updated_at: philippineTimeFull },{ new: true });

        if (!updatedComputerSet) {
            return res.status(404).json({ message: "Computer Set not found" });
        }

        res.status(200).json({
            isSuccess: true,
            updatedComputerSet
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

export default {getList, addComputerSet, deleteComputerSet, editComputerSet}