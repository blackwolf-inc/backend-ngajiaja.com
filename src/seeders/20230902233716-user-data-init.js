const { getHash } = require('../helpers/passwordHash');
const { roleUser } = require('../helpers/constanta');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        role: roleUser.SUPER_ADMIN,
        nama: 'superadmin',
        email: 'superadmin.ngajiaja@yopmail.com',
        telp_wa: '08123456789',
        jenis_kelamin: 'L',
        alamat: 'Bandara Mas, Batam',
        usia: 33,
        password: getHash('password'),
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: roleUser.ADMIN,
        nama: 'admin1',
        email: 'admin1.ngajiaja@yopmail.com',
        telp_wa: '08123456789',
        jenis_kelamin: 'L',
        alamat: 'KDA, Batam',
        usia: 33,
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
