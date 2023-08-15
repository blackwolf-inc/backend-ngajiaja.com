const { Router } = require('express');
const UserController = require('./controllers/user.controller');
const PengajarController = require('./controllers/teacher.controller');
const StudentController = require('./controllers/student.controller');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const { createUserValidator, updateUserValidator } = require('./validators/user.validator');

router.get('/test', (req, res) => {
  res.send('test registration');
});

// users route
router.get('/user', UserController.getAll);
router.get('/user/:id', UserController.getOne);
router.post('/user', validate(createUserValidator), UserController.create);
router.patch('/user/:id', validate(updateUserValidator), UserController.update);
router.delete('/user/:id', UserController.delete);

// Teacher Route
router.get('/pengajar', PengajarController.getAll);
router.get('/pengajar/:id', PengajarController.getOne);
router.post('/pengajar', PengajarController.create);
router.patch('/pengajar/:id', PengajarController.update);
router.delete('/pengajar', PengajarController.delete);

// students route
router.get('/student', StudentController.getAll);
router.get('/student/:id', StudentController.getOne);
router.post('/student', StudentController.create);
router.patch('/student/:id', StudentController.update);
router.delete('/student/:id', StudentController.delete);

module.exports = router;
