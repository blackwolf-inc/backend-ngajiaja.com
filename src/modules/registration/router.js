const { Router } = require('express');
const UserController = require('./controllers/user.controller');
const router = Router();

router.get('/test', (req, res) => {
  res.send('test registration');
});

router.get('/user', UserController.getAll);
router.get('/user/:id', UserController.getOne);
router.post('/user', UserController.create);
router.patch('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

module.exports = router;
