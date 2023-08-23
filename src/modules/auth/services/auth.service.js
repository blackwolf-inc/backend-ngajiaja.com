const { validationResult } = require('express-validator');
const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { UserResetPassword } = require('../../../models');
const crypto = require('crypto');
const { Op } = require("sequelize");

class AuthService extends BaseService {
    async generateResetPasswordToken(req) {
        const service = new AuthService(req, UserResetPassword);
        service.__remove({where: {user_id: req.body.user.id}});
        const date = new Date();
        const payload = {
            'user_id': req.body.user.id,
            'reset_token': crypto.randomBytes(32).toString('hex'),
            'expired_date': date.setDate(date.getDate() + 1),
        }
        
        return await service.createData(payload);
    }

    async getDetailByToken(token) {
        const userResetPassword = await UserResetPassword.findOne({where: 
            { 
                reset_token: token, 
                expired_date: {
                    [Op.gt]: new Date(),
                }
            }
        });

        if (!userResetPassword) {
            throw ApiError.badRequest(`Token not found`);
        }

        return userResetPassword; 
    }

    async removeUserToken(userId) {
        await UserResetPassword.destroy({where: {user_id: userId}});
    }

}

module.exports = AuthService;
