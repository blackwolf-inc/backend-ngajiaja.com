const process = require('process');
process.env.NODE_ENV='test';
const expect = require('chai').expect;
const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.BASE_URL_TEST;
const db = require('../../src/models/index');
const { User, UserResetPassword, sequelize } = db;
const { checkHash } = require('../../src/helpers/passwordHash');
const TEST_EMAIL = 'test@test.com';

describe("User request reset password", () => {
    before(async function() {
        await UserResetPassword.destroy({truncate: {cascade: true}});
        await User.destroy({truncate: {cascade: true}});
        let payload = {
            "role": "PENGAJAR",
            "nama": "testing",
            "email": TEST_EMAIL,
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
        const response = await axios.post(BASE_URL + '/auth/request-reset-password', {email: TEST_EMAIL});
        expect(response.status).to.be.equal(200);
        const user = await User.findOne({where: {email: TEST_EMAIL}});
        const userResetPassword = await UserResetPassword.findOne({where: {user_id: user.id}});
        expect(userResetPassword.user_id).to.equal(user.id);      
    });

    it('change password and remove previous token', async () => {
        await axios.post(BASE_URL + '/auth/request-reset-password', {email: TEST_EMAIL});
        const user = await User.findOne({where: {email: TEST_EMAIL}});
        const token = await UserResetPassword.findOne({where: {user_id: user.id}});
        const response = await axios.post(BASE_URL + '/auth/reset-password', {password: "Test12345", token: token.reset_token});
        expect(response.status).to.be.equal(200);
        const updatedUser = await User.findOne({where: {email: TEST_EMAIL}});
        expect(checkHash("Test12345", updatedUser.password)).to.equal(true);  
    });

});
