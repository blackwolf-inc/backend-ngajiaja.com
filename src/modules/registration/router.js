const { Router } = require('express');
const UserController = require('./controllers/user.controller');
const StudentController = require('./controllers/student.controller');
const router = Router();

router.get('/test', (req, res) => {
  res.send('test registration');
});

// users route
router.get('/user', UserController.getAll);
router.get('/user/:id', UserController.getOne);
router.post('/user', UserController.create);
router.patch('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

// students route
router.get('/student', StudentController.getAll);
router.get('/student/:id', StudentController.getOne);
router.post('/student', StudentController.create);
router.patch('/student/:id', StudentController.update);
router.delete('/student/:id', StudentController.delete);

module.exports = router;
