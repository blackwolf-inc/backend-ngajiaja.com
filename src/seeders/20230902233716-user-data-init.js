const { getHash } = require('../helpers/passwordHash');
const { USER_ROLE } = require('../helpers/constanta');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        role: USER_ROLE.SUPER_ADMIN,
        nama: 'superadmin',
        email: 'superadmin.ngajiaja@yopmail.com',
        telp_wa: '08123456789',
        jenis_kelamin: 'L',
        alamat: 'Bandara Mas, Batam',
        password: getHash('password'),
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: USER_ROLE.ADMIN,
        nama: 'admin1',
        email: 'admin1.ngajiaja@yopmail.com',
        telp_wa: '08123456789',
        jenis_kelamin: 'L',
        alamat: 'KDA, Batam',
        password: getHash('password'),
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
