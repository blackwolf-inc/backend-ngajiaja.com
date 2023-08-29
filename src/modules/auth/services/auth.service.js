const { validationResult } = require('express-validator');
const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { UserResetPassword, User } = require('../../../models');
const SendEmailNotification = require('../../../utils/nodemailer');
const process = require('process');
const BASE_URL = process.env.BASE_URL_TEST;

class AuthService extends BaseService {

    stringGen(len) {
        var text = "";    
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++)
          text += charset.charAt(Math.floor(Math.random() * charset.length));
        
        return text;
    }

    async generateResetPasswordToken(req) {
        const service = new AuthService(req, UserResetPassword);
        service.__remove({where: {user_id: req.body.user.id}});
        const payload = {
            'user_id': req.body.user.id,
            'reset_token': this.stringGen(30),
        }
        
        return await service.createData(payload);
    }

    async getDetailByToken(token) {
        const userResetPassword = await UserResetPassword.findOne({
            include: [{
                model: User,
                as: 'user'
            }],
            where: { 
                reset_token: token, 
            },
        });

        if (!userResetPassword) {
            throw ApiError.badRequest(`Token not found`);
        }

        return userResetPassword; 
    }

    async removeUserToken(userId) {
        await UserResetPassword.destroy({where: {user_id: userId}});
    }

    async sendNotificationEmail(user, token) {
        let url = BASE_URL + 'auth/reset-password/' + token
        const getHtml = await SendEmailNotification.getHtml('resetPassword.ejs', {
          user,
          url,
        });

        return await SendEmailNotification.sendMail(user.email, 'Reset Password Notification', getHtml);
      }    

}

module.exports = AuthService;
