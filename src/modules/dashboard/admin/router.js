const { Router } = require('express');
const router = Router();
const validate = require('../../../utils/validatorIndex');
const storage = require('../../../utils/storageImage');
const isAuthenticate = require('../../../middlewares/authentication');
const { USER_ROLE } = require('../../../helpers/constanta');
const { hasRole } = require('../../../middlewares/roleAuth');
const AdminDashboardController = require('./controllers/admin.controller.js');
const updatePencairanPengajar = require('./validators/adminTransaksi.validator.js');
const {
  updateStatusPengajar,
  updateLinkWawancara,
} = require('./validators/adminPengajar.validator');
const AdminDashboard = require('./services/adminDashboard.service.js');
const { image } = require('../../../utils/storageImage');

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard admin',
  });
});

router.use(hasRole([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN]));
router.get('/data/pengajar', AdminDashboardController.dataPengajar);
router.patch('/data/pengajar/terdaftar/:userId', AdminDashboardController.updateWawancara);
router.patch('/data/pengajar/terverifikasi/:userId', AdminDashboardController.updateStatusPengajar);

router.get('/data/pengajar/terdaftar', AdminDashboardController.getPengajarRegistered);
router.get('/data/pengajar/terverifikasi', AdminDashboardController.getPengajarVerified);

router.get('/data/peserta', AdminDashboardController.getAllDataPeserta);
router.get('/data/peserta/terdaftar', AdminDashboardController.getPesertaRegistered);
router.patch('/data/peserta/terdaftar/:userId', AdminDashboardController.updateStatusPeserta);

router.get('/data/peserta/terverifikasi', AdminDashboardController.getPesertaVerified);
router.patch(
  '/data/peserta/terverifikasi/:userId',
  AdminDashboardController.updateStatusPesertaVerified
);

router.get('/data/dashboard-admin', AdminDashboardController.getDataDashboardAdmin);
router.get('/data/dashboard-admin/bimbingan', AdminDashboardController.getAllBimbingan);

router.get('/data/period', AdminDashboardController.getAllCourse);
router.get('/data/period/ongoing', AdminDashboardController.getCourseOngoing);
router.get('/data/period/finished', AdminDashboardController.getCourseFinished);
router.get('/data/period/ongoing/:periodId', AdminDashboardController.getCourseOngoingById);
router.get('/data/period/finished/:periodId', AdminDashboardController.getCourseFinishedById);

router.get(
  '/data/pengajar/terdaftar/export',
  AdminDashboardController.exportDataPengajarRegistered
);
router.get(
  '/data/pengajar/terverifikasi/export',
  AdminDashboardController.exportDataPengajarVerified
);

router.get('/data/peserta/terdaftar/export', AdminDashboardController.exportDataPesertaRegistered);
router.get(
  '/data/peserta/terverifikasi/export',
  AdminDashboardController.exportDataPesertaVerified
);

router.get('/data/period/ongoing/export/csv', AdminDashboardController.exportDataBimbinganOngoing);
router.get(
  '/data/period/finished/export/csv',
  AdminDashboardController.exportDataBimbinganFinished
);

router.post('/article-category', AdminDashboardController.createArticleCategory);
router.delete('/article-category/:id', AdminDashboardController.deleteArticleCategory);

router.post(
  '/create-article',
  image.single('article_thumbnail'),
  AdminDashboardController.createArticle
);
router.patch(
  '/update-article/:id',
  image.single('article_thumbnail'),
  AdminDashboardController.updateArticle
);

router.get('/infaq-peserta', AdminDashboardController.getInfaqPeserta);
router.get('/infaq-peserta/export', AdminDashboardController.exportInfaq);
router.get('/pencairan-pengajar', AdminDashboardController.getPencairanPengajar);
router.patch(
  '/pencairan-pengajar/:id',
  validate(updatePencairanPengajar),
  storage.image.single('media'),
  AdminDashboardController.updatePencairanPengajar
);

router.get('/article-list', AdminDashboardController.getArticleList);
router.get('/article-category', AdminDashboardController.getArticleCategoryList);
router.patch('/article-category/:categoriesId', AdminDashboardController.updateArticleCategory);

router.delete('/article/:articleId', AdminDashboardController.deleteArticleAdmin);

router.post('/testimonies', image.single('testimony_picture'), AdminDashboardController.createTestimonies);
router.patch('/testimonies/:testimonyId', image.single('testimony_picture'), AdminDashboardController.updateTestimonies);
router.delete('/testimonies/:testimonyId', AdminDashboardController.deleteTestimonies);
router.get('/testimonies', AdminDashboardController.getTestimonies);

router.patch('/change-user-password/:userId', AdminDashboardController.changeUserPassword);

module.exports = router;
