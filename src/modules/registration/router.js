const { Router } = require('express');
const UserController = require('./controllers/user.controller');
const PengajarController = require('./controllers/teacher.controller');
const router = Router();

router.get('/test', (req, res) => {
  res.send('test registration');
});

router.get('/user', UserController.getAll);
router.get('/user/:id', UserController.getOne);
router.post('/user', UserController.create);
router.patch('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

// Teacher Route
router.get('/pengajar', PengajarController.getAll);
router.get('/pengajar/:id', PengajarController.getOne);
router.post('/pengajar', PengajarController.create);
router.patch('/pengajar/:id', PengajarController.update);
router.delete('/pengajar', PengajarController.delete);

module.exports = router;
