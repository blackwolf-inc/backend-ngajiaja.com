const { formatDateLocal } = require('../../../helpers/dateConverter');
const { getHash } = require('../../../helpers/passwordHash');
const UserService = require('../services/user.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { User, Peserta, Pengajar, sequelize } = db;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

class UserController {
  static async getOne(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getOneUser(req.params.id);
      delete result.password;
      delete result.token;
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getAllUsers();
      for (const data of result.datas) {
        delete data.password;
        delete data.token;
      }
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new UserService(req, User);
    try {
      const body = await UserController.#bodyHandler(req.body);
      await service.checkIsEmailExist(body.email);
      const result = await service.createData(body);
      delete result.password;
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    /* can not use bodyHandler since need to update partially */
    const service = new UserService(req, User);
    try {
      if (req.body.password) {
        req.body.password = getHash(req.body.password);
      }
      if (req.body.tgl_lahir) {
        req.body.tgl_lahir = formatDateLocal(req.body.tgl_lahir);
      }

      const result = await service.updateUserData(req.body, { id: req.params.id });
      delete result.password;
      delete result.token;
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new UserService(req, User);
    try {
      await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`);
    } catch (error) {
      next(error);
    }
  }

  static async #bodyHandler(body) {
    return {
      role: body.role,
      nama: body.nama,
      email: body.email,
      telp_wa: body.telp_wa,
      jenis_kelamin: body.jenis_kelamin,
      alamat: body.alamat,
      tgl_lahir: formatDateLocal(body.tgl_lahir),
      status: body.status,
      password: getHash(body.password),
      token: body.token,
      profile_picture: body.profile_picture || 'public/profile-picture/default_pp.png',
    };
  }

  static async updateUser(req, res) {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile_picture;
    let filePath;
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      profile_picture = `${Date.now()}${extension}`;
      filePath = `images/${profile_picture}`;

      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'File must be an image' });
      }

      if (!fs.existsSync('images')) {
        fs.mkdirSync('images');
      }

      fs.renameSync(req.file.path, filePath);
    }
    if (req.body.password) {
      req.body.password = getHash(req.body.password);
    }
    if (req.body.tgl_lahir) {
      req.body.tgl_lahir = formatDateLocal(req.body.tgl_lahir);
    }

    const { nama, email, telp_wa, jenis_kelamin, alamat, status, password, tgl_lahir, profesi, pendidikan_terakhir } = req.body;

    const updatePayload = {
      nama,
      email,
      telp_wa,
      jenis_kelamin,
      alamat,
      status,
      password,
      tgl_lahir,
      profile_picture,
      profesi,
      pendidikan_terakhir
    };

    const updatedUser = await User.update(updatePayload, {
      where: { id }
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'PESERTA') {
      await Peserta.update({ profesi }, {
        where: { user_id: id }
      });
    }

    if (user.role === 'PENGAJAR') {
      await Pengajar.update({ pendidikan_terakhir }, {
        where: { user_id: id }
      });
    }

    return responseHandler.succes(res, `Success update user id ${id}`, updatePayload);
  }

  static async getAdminProfile(req, res) {
    const service = new UserService(req, User);
    try {
      const result = await service.getAdminProfile(req.params.id);
      return responseHandler.succes(res, `Success get admin profile ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = UserController;
