const { Router } = require('express');
const UserController = require('./controllers/user.controller');
const PengajarController = require('./controllers/teacher.controller');
const StudentController = require('./controllers/student.controller');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const { createUserValidator, updateUserValidator } = require('./validators/user.validator');
const {
  createTeacherValidator,
  updateTeacherValidator,
} = require('./validators/teacher.validator');
const students = require('./validators/student.validator');
const isAuthenticate = require('./../../middlewares/authentication');
const { hasRole } = require('../../middlewares/roleAuth');
const { USER_ROLE } = require('../../helpers/constanta');

router.get('/test', (req, res) => {
  res.send('test registration');
});

// create user without auth
router.post('/user', validate(createUserValidator), UserController.create);

// after login everything need to check auth
router.use(isAuthenticate);

// users route
router.get('/user', UserController.getAll);
router.get('/user/:id', UserController.getOne);
router.patch('/user/:id', validate(updateUserValidator), UserController.update);
router.delete(
  '/user/:id',
  hasRole([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN]),
  UserController.delete
);

// Teacher Route
router.get('/pengajar', PengajarController.getAll);
router.get('/pengajar/:id', PengajarController.getOne);
router.post('/pengajar', validate(createTeacherValidator), PengajarController.create);
router.patch('/pengajar/:id', validate(updateTeacherValidator), PengajarController.update);
router.delete('/pengajar', PengajarController.delete);

// students route
router.get('/student', StudentController.getAll);
router.get('/student/:id', StudentController.getOne);
router.post('/student', validate(students.createStudentValidator), StudentController.create);
router.patch('/student/:id', validate(students.updateStudentValidator), StudentController.update);
router.delete('/student/:id', StudentController.delete);

// students route jadwal_bimbingan_peserta
router.post(
  '/student/jadwal',
  validate(students.createJadwalValidator),
  StudentController.createJadwalBimbingan
);

module.exports = router;
