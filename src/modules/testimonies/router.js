const { Router } = require('express');
const router = Router();
const TestimoniesController = require('./controllers/testimonies.controllers');

router.get('/test', (req, res) => {
    res.send('test testimonies');
});

router.get('/', TestimoniesController.getTestimonies);


module.exports = router;