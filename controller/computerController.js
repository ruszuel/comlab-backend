import { computer } from "../model/model";

const getList = async(req, res) => {
    try{
        const com = await computer.find();
        res.status(200).json({
          isSuccess: true,
          com
        })
    }catch(err){
        console.log(err);
    }
}

export default {getList}