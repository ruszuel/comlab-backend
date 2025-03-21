import { computer } from "../model/model.js";

const getList = async(req, res) => {
  try {
    const com = await computer.find();
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

const addComputer = async (req, res) => {
    const {name, room} = req.body
    try {
        const isExisting = await computer.findOne({name})
        if(isExisting){
            return res.sendStatus(403)
        }
        const newComputer = new computer({name, room})
        await newComputer.save();
        res.status(200).json({
            isSuccess: true,
            newComputer
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

const deleteCom = async (req, res) => {
    const {_id} = req.params
    try{
        const delCom = await computer.deleteOne({_id});
        if(delCom.deletedCount === 0){
            return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ message: "Data set deleted successfully" });
    }catch(err){
        res.status(500).json({ error: error.message });
    }
}

export default {getList, addComputer, deleteCom}