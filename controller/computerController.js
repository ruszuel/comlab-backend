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

export default {getList}