import { adminModel, teacherModel} from "../model/model.js";
import bcrytp from 'bcrypt'

const auth = async (req, res) => {
    const {id, pass} = req.body
    try {
        const admins = await adminModel.findOne({id});
        const faculties = await teacherModel.findOne({teacher_id: id});
        if(admins){
            if(await bcrytp.compare(pass, admins.password)){
                return res.status(201).json(admins)
            }
        }
        if(faculties){
            if(await bcrytp.compare(pass, faculties.password)){
                return res.status(200).json(faculties)
            }
        }
        return res.sendStatus(404)
    } catch (error) {
        return res.sendStatus(500)
    }
}

export default {auth}