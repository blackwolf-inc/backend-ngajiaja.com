const { Router } = require('express');
const router = Router();

router.get('/test', (req, res) => {
  res.send('test report');
});

module.exports = router;
