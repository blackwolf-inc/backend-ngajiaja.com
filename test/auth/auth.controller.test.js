const process = require('process');
process.env.NODE_ENV='test';
const expect = require('chai').expect;
const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.BASE_URL;
const db = require('../../src/models/index');
const { User, UserResetPassword, sequelize } = db;
const { checkHash, getHash } = require('../../src/helpers/passwordHash');

describe("User request reset password", () => {
    before(async function() {
        await UserResetPassword.destroy({truncate: {cascade: true}});
        await User.destroy({truncate: {cascade: true}});
        let payload = {
            "role": "PENGAJAR",
            "nama": "testing",
            "email": "test@test.com",
            "telp_wa": "081234567890",
            "jenis_kelamin": "L",
            "alamat": "Indonesia",
            "usia": "15",
            "password": "12345678"
        };
        await User.create(payload);
        return true;
    });
        
    it('request reset password and then send reset password', async () => {
        const response = await axios.post(BASE_URL + '/auth/request-reset-password', {email: "test@test.com"});
        expect(response.status).to.be.equal(200);
        const user = await User.findOne({where: {email: 'test@test.com'}});
        const userResetPassword = await UserResetPassword.findOne({where: {user_id: user.id}});
        expect(userResetPassword.user_id).to.equal(user.id);      
    });

    it('change password and remove previous token', async () => {
        const user = await User.findOne({where: {email: "test@test.com"}});
        const token = await UserResetPassword.findOne({where: {user_id: user.id}});
        const response = await axios.post(BASE_URL + '/auth/reset-password', {password: "Test12345", token: token.reset_token});
        expect(response.status).to.be.equal(200);
        const updatedUser = await User.findOne({where: {email: "test@test.com"}});
        expect(checkHash("Test12345", updatedUser.password)).to.equal(true);  
    });

});
