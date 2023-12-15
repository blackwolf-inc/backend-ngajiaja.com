const { Router } = require('express');
const router = Router();
const QuranController = require('./controllers/quran.controllers');

router.get('/test', (req, res) => {
    res.send('test quran');
});

router.get('/index', QuranController.getQuranIndex)
router.get('/surat/:id', QuranController.getQuranAyat)
router.get('/surat/:idSurat/:noAyat', QuranController.getQuranAyatBySuratAndAyat)

module.exports = router;