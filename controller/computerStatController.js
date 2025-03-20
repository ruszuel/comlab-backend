import { computerStats } from "../model/model.js";

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
    const {pc_id, comlabid, name, condition, status} = req.body
    try {
        // const isExisting = await computerStats.findOne({name})
        // if(isExisting){
        //     return res.sendStatus(403)
        // }

        const newComputerSet = new computerStats({pc_id, comlabid, name, condition, status, date_added: new Date().toISOString().split('T')[0]})
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
export default {getList, addComputerSet}