const { getHash } = require('../../../helpers/passwordHash');
const UserService = require('../services/user.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { User, sequelize } = db;
const nodemailer = require('nodemailer');

class UserController {
  static async getOne(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getOneById(req.params.id);
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
      const result = await service.getAll();
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
      req.body.password = getHash(req.body.password);
      const result = await service.createData(req.body);
      delete result.password;
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new UserService(req, User);
    try {
      if (req.body.password) {
        req.body.password = getHash(req.body.password);
      }
      const result = await service.updateData(req.body, { id: req.params.id });
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

  static async testSendEmail(req, res, next) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'mail.ngajiaja.com',
        port: 465,
        secure: true,
        auth: {
          user: 'no-reply@ngajiaja.com',
          pass: '.38r@XK0_Wqu',
        },
      });

      const mailOption = {
        from: 'no-reply@ngajiaja.com',
        to: 'najib.ngajiaja@yopmail.com',
        subject: 'Pendaftaran',
        html: `
              <h3>Halo Najib!</h3>
              <p>
              Kami telah menerima pendaftaran anda.
              <br />
            `,
      };

      transporter.sendMail(mailOption, function (error, response) {
        if (error) {
          console.log(error);
          return res.status(500).send(error);
        } else {
          return res.status(200).json({
            message: 'Email has been sent',
          });
        }
      });
      transporter.close();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
