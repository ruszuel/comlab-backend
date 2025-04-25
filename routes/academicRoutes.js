import express from 'express'
import courseController from '../controller/courseController.js';
import subjectController from '../controller/subjectController.js';
import sectionController from '../controller/sectionController.js';
import semesterController from '../controller/semesterController.js';

const route = express.Router()

// Courses
route.post('/addCourse', courseController.addCourse)
route.post('/editCourse/:_id', courseController.editCourse)
route.delete('/deleteCourse/:_id', courseController.deleteCourse)
route.get('/getCourses', courseController.getCourses)

// Subjects
route.post('/addSubject', subjectController.addSubject)
route.post('/editSubject/:_id', subjectController.editSubject)
route.delete('/deleteSubject/:_id', subjectController.deleteSubject)
route.get('/getSubjects', subjectController.getSubjects)

// Section
route.post('/addSection', sectionController.addSection)
route.post('/editSection/:_id', sectionController.editSection)
route.delete('/deleteSection/:_id', sectionController.deleteSection)
route.get('/getSections', sectionController.getSections)

// Semester
route.post('/addSemester', semesterController.addSemester)
route.post('/editSemester/:_id', semesterController.editSemester)
route.delete('/deleteSemester/:_id', semesterController.deleteSemester)
route.get('/getSemester', semesterController.getSemester)

export default route;