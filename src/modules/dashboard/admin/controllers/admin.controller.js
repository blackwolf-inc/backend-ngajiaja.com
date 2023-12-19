const AdminPengajarService = require('../services/adminPengajar.service.js');
const AdminPesertaService = require('../services/adminPeserta.service.js');
const AdminDashboard = require('../services/adminDashboard.service.js');
const AdminManageCourseService = require('../services/adminKelolaBimbingan.js');
const AdminTransaksiService = require('../services/adminTransaksi.service.js');
const { Infaq, Pencairan } = require('../../../../models');
const responseHandler = require('../../../../helpers/responseHandler');
const fs = require('fs');
const Papa = require('papaparse');
const AdminArticle = require('../services/adminArticle.service.js');
const storageImage = require('../../../../utils/storageImage.js');
const path = require('path');

class AdminDashboardController {
  static async dataPengajar(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const result = await service.getDataPengajar();
      return responseHandler.succes(res, 'Success get data pengajar all', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateWawancara(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { userId } = req.params;
      const {
        link_wawancara,
        tanggal_wawancara,
        jam_wawancara,
        status_pengajar,
        isVerifiedByAdmin,
        level_pengajar,
      } = req.body;
      const result = await service.updateJadwalWawancara(
        req,
        {
          link_wawancara,
          tanggal_wawancara,
          jam_wawancara,
          status_pengajar,
          isVerifiedByAdmin,
          level_pengajar,
        },
        userId
      );
      return responseHandler.succes(res, 'Success update pengajar registered', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusPengajar(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { userId } = req.params;
      const { status_pengajar, level_pengajar, persentase_bagi_hasil } = req.body;
      const result = await service.updateStatusPengajar(
        req,
        { status_pengajar, level_pengajar, persentase_bagi_hasil },
        userId
      );
      return responseHandler.succes(res, 'Success update status pengajar', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPengajarRegistered(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { query } = req;
      const { status, keyword, startDate, endDate } = query;
      const result = await service.getPesertaPengajarRegistered(
        query,
        status,
        keyword,
        startDate,
        endDate
      );
      return responseHandler.succes(res, 'Success get pengajar Terdaftar', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPengajarVerified(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { query } = req;
      const { status, keyword, level } = query;
      let result = await service.getPesertaPengajarVerified(query, status, keyword, level);
      // result = result?.result?.map((item) => ({ ...item, bagi_hasil: 50 }));
      return responseHandler.succes(res, 'Success get pengajar Terverifikasi', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllDataPeserta(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const result = await service.getDataPeserta();
      return responseHandler.succes(res, 'Success get all data peserta', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPesertaRegistered(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const { query } = req;
      const { status, keyword, startDate, endDate, bankName } = query;
      const result = await service.getPesertaRegistered(
        query,
        status,
        keyword,
        startDate,
        endDate,
        bankName
      );
      return responseHandler.succes(res, 'Success get peserta Terdaftar', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusPeserta(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const { userId } = req.params;
      const { status_peserta, level_peserta } = req.body;
      const result = await service.updateStatusPeserta(
        req,
        { status_peserta, level_peserta },
        userId
      );
      return responseHandler.succes(res, 'Success update status peserta', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPesertaVerified(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const { query } = req;
      const { status, keyword, level } = query;
      const result = await service.getPesertaVerified(query, status, keyword, level);
      return responseHandler.succes(res, 'Success get peserta Terverifikasi', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusPesertaVerified(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const { userId } = req.params;
      const { status_peserta, level_peserta } = req.body;
      const result = await service.updateStatusPesertaVerified(
        req,
        { status_peserta, level_peserta },
        userId
      );
      return responseHandler.succes(res, 'Success update status peserta', result);
    } catch (error) {
      next(error);
    }
  }

  static async getDataDashboardAdmin(req, res, next) {
    const service = new AdminDashboard();
    try {
      const result = await service.getDataAdminDashboard();
      return responseHandler.succes(res, 'Success get data dashboard admin', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllBimbingan(req, res, next) {
    const service = new AdminDashboard();
    try {
      const { granularity, startDate, endDate } = req.query;
      const result = await service.getAllBimbingan(granularity, startDate, endDate);
      return responseHandler.succes(res, 'Success get all bimbingan', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCourse(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const result = await service.getAllDataCourse();
      return responseHandler.succes(res, 'Success get all course', result);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseOngoing(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { query } = req;
      const { keywordStudent, keywordTeacher } = query;
      const result = await service.getCourseOngoing(query, keywordStudent, keywordTeacher);
      return responseHandler.succes(res, 'Success get course ongoing', result);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseFinished(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { query } = req;
      const { keywordStudent, keywordTeacher, startDate, endDate } = query;
      const result = await service.getCourseFinished(
        query,
        keywordStudent,
        keywordTeacher,
        startDate,
        endDate
      );
      return responseHandler.succes(res, 'Success get course finished', result);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseOngoingById(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { periodId } = req.params;
      const result = await service.getCourseOngoingById(periodId);
      return responseHandler.succes(res, 'Success get course ongoing by id', result);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseFinishedById(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { periodId } = req.params;
      const result = await service.getCourseFinishedById(periodId);
      return responseHandler.succes(res, 'Success get course finished by id', result);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataPengajarRegistered(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { query } = req;
      const { startDate, endDate } = query;
      const result = await service.getPengajarRegisteredExport(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `PengajarRegistered_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataPengajarVerified(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { query } = req;
      const { startDate, endDate } = query;
      const result = await service.getPengajarVerifiedExport(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `PengajarVerified_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataPesertaRegistered(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const { query } = req;
      const { startDate, endDate } = query;
      const result = await service.getPesertaRegisteredExport(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `PesertaRegistered_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataPesertaVerified(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const { query } = req;
      const { startDate, endDate } = query;
      const result = await service.getPesertaVerifiedExport(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `PesertaVerified_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataBimbinganOngoing(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { query } = req;
      const { startDate, endDate } = query;
      const result = await service.getCourseOngoingExport(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `BimbinganOngoing_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataBimbinganFinished(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { query } = req;
      const { startDate, endDate } = query;
      const result = await service.getCourseFinishedExport(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `BimbinganFinished_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async createArticleCategory(req, res, next) {
    const service = new AdminArticle();
    try {
      const { categories } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      const result = await service.createArticleCategoryService({ categories }, token);
      return responseHandler.succes(res, 'Success create article category', result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteArticleCategory(req, res, next) {
    const service = new AdminArticle();
    try {
      const { id } = req.params;
      const result = await service.deleteArticleCategoryService(id);
      return responseHandler.succes(res, 'Success delete article category', result);
    } catch (error) {
      next(error);
    }
  }

  static async createArticle(req, res, next) {
    const service = new AdminArticle();
    try {
      const {
        article_title,
        article_body,
        article_category_id,
        article_picture,
        main_article,
        archived_article,
      } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      let article_thumbnail;
      let filePath;
      if (req.file) {
        const extension = path.extname(req.file.originalname);
        article_thumbnail = `${Date.now()}${extension}`;
        filePath = `images/${article_thumbnail}`;

        if (!req.file.mimetype.startsWith('image/')) {
          return res.status(400).json({ message: 'File must be an image' });
        }

        if (!fs.existsSync('images')) {
          fs.mkdirSync('images');
        }

        fs.renameSync(req.file.path, filePath);
      }
      const result = await service.createArticleService(
        {
          article_title,
          article_body,
          article_category_id,
          article_picture,
          main_article,
          archived_article,
          article_thumbnail,
        },
        token
      );
      return responseHandler.succes(res, 'Success create article category', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateArticle(req, res, next) {
    const service = new AdminArticle();
    try {
      const { id } = req.params;
      const {
        article_title,
        article_body,
        article_category_id,
        article_picture,
        main_article,
        archived_article,
      } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      let article_thumbnail;
      let filePath;
      if (req.file) {
        const extension = path.extname(req.file.originalname);
        article_thumbnail = `${Date.now()}${extension}`;
        filePath = `images/${article_thumbnail}`;

        if (!req.file.mimetype.startsWith('image/')) {
          return res.status(400).json({ message: 'File must be an image' });
        }

        if (!fs.existsSync('images')) {
          fs.mkdirSync('images');
        }

        fs.renameSync(req.file.path, filePath);
      }
      const result = await service.updateArticleService(
        {
          article_title,
          article_body,
          article_category_id,
          article_picture,
          main_article,
          archived_article,
          article_thumbnail,
        },
        token,
        id
      );
      return responseHandler.succes(res, 'Success update article category', result);
    } catch (error) {
      next(error);
    }
  }

  static async getInfaqPeserta(req, res, next) {
    try {
      const { query } = req;
      const adminTransaksiService = new AdminTransaksiService(req, Infaq);
      const result = await adminTransaksiService.getInfaqPeserta(query);
      return responseHandler.succes(res, 'Success get data infaq Peserta', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPencairanPengajar(req, res, next) {
    try {
      const { query } = req;
      const adminTransaksiService = new AdminTransaksiService(req, Pencairan);
      const result = await adminTransaksiService.getPencairanPengajar(query);
      return responseHandler.succes(res, 'Success get data pencairan pengajar', result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePencairanPengajar(req, res, next) {
    const service = new AdminTransaksiService(req, Pencairan);
    try {
      await Promise.all([
        await service.checkPencairanById(req.params.id),
        await service.updateImages(req),
      ]);
      const result = await service.updateData(req.body, { id: req.params.id });
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getArticleList(req, res, next) {
    const service = new AdminArticle();
    try {
      const { query } = req;
      const { page, pageSize } = query;
      const result = await service.getArticleListService(page, pageSize);
      return responseHandler.succes(res, 'Success get article list', result);
    } catch (error) {
      next(error);
    }
  }

  static async getArticleCategoryList(req, res, next) {
    const service = new AdminArticle();
    try {
      const { query } = req;
      const { page, pageSize } = query;
      const result = await service.getArticleCategoryListService(page, pageSize);
      return responseHandler.succes(res, 'Success get article category list', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateArticleCategory(req, res, next) {
    const service = new AdminArticle();
    try {
      const { categoriesId } = req.params;
      const { categories } = req.body;
      const result = await service.updateArticleCategoryService(categories, categoriesId);
      return responseHandler.succes(res, 'Success update article category', result);
    } catch (error) {
      next(error);
    }
  }

  static async exportInfaq(req, res, next) {
    const service = new AdminTransaksiService(req, Infaq);
    try {
      const { startDate, endDate } = req;
      const result = await service.exportInfaqPeserta(startDate, endDate);
      const csv = Papa.unparse(result);
      const date = +new Date();

      const filename = `InfaqPeserta_${date}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async deleteArticleAdmin(req, res, next) {
    const service = new AdminArticle();
    try {
      const { articleId } = req.params;
      const result = await service.deleteArticleByIdService(articleId);
      return responseHandler.succes(res, 'Success delete article', result);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = AdminDashboardController;
