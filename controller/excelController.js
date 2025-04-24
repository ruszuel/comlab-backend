import { studentModel } from "../model/model.js";
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const saveFile = (file) => {
  const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../tmp');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const fileName = Date.now() + path.extname(file.name);
  const filePath = path.join(uploadDir, fileName);
  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) { 
        console.error('Error moving file:', err); 
        reject('Error uploading file: ' + err); 
      }
      else { 
        console.log('File saved successfully to:', filePath); 
        resolve(filePath); 
      }
    });
  });
};

const uploadExcel = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({ 
        isSuccess: false, 
        message: 'No file uploaded' 
      });
    }
    
    const excelFilePath = await saveFile(req.files.excelFile);
    if (!fs.existsSync(excelFilePath)) {
      return res.status(500).json({ 
        isSuccess: false, 
        message: 'File not found at expected path' 
      });
    }
    
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log('Parsed data:', JSON.stringify(data, null, 2));

    const savedStudents = [], duplicateStudents = [], invalidStudents = [];
    
    for (let row of data) {
      const student_id = row.student_id || row['student_id'];
      const firstname = row.firstname || row['firstname'];
      const lastname = row.lastname || row['lastname'];
      const course = row.course || row['course'];
      const section = row.section || row['section'];

      if (!student_id || !firstname || !lastname || !course || !section) { 
        invalidStudents.push({
          ...row, 
          reason: 'Missing required fields (student_id, firstname, lastname, course, or section)'
        }); 
        continue; 
      }

      try {
        // Check if student_id already exists
        const existingStudent = await studentModel.findOne({ student_id });

        if (existingStudent) {
          duplicateStudents.push({
            ...row, 
            reason: 'student_id already exists'
          });
          continue;
        }
        
        const newStudent = new studentModel({
          student_id, 
          firstname,
          lastname,
          course,
          section
        });
        
        await newStudent.save();
        savedStudents.push(newStudent);
      } catch (error) { 
        invalidStudents.push({
          ...row, 
          error: error.message
        }); 
      }
    }

    fs.unlinkSync(excelFilePath);
    res.status(200).json({
      isSuccess: true,
      message: `${savedStudents.length} students added successfully`,
      savedStudents, 
      duplicates: duplicateStudents.length,
      duplicateDetails: duplicateStudents,
      invalidEntries: invalidStudents.length, 
      invalidDetails: invalidStudents,
      totalProcessed: data.length
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ 
      isSuccess: false, 
      message: 'Error processing Excel file', 
      error: error.message 
    });
  }
};

module.exports = { uploadExcel };