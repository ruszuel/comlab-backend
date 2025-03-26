import express from 'express'
import courseController from '../controller/courseController.js';
import subjectController from '../controller/subjectController.js';
import sectionController from '../controller/sectionController.js';

const route = express.Router()

// Courses
route.post('/addCourse', courseController.addCourse)
route.post('/editCourse', courseController.editCourse)
route.delete('/deleteCourse', courseController.deleteCourse)
route.get('/getCourses', courseController.getCourses)

// Subjects
route.post('/addSubject', subjectController.addSubject)
route.post('/editSubject', subjectController.editSubject)
route.delete('/deleteSubject', subjectController.deleteSubject)
route.get('/getSubjects', subjectController.getSubjects)

// Section
route.post('/addSection', sectionController.addSection)
route.post('/editSection', sectionController.editSection)
route.delete('/deleteSection', sectionController.addSection)
route.get('/getSections', sectionController.getSections)

export default route;