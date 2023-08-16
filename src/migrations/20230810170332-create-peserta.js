'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pesertas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      profesi: {
        type: Sequelize.STRING,
      },
      bisa_baca_ayat: {
        type: Sequelize.STRING,
      },
      menguasai_ilmu_tajwid: {
        type: Sequelize.INTEGER,
      },
      paham_aplikasi_meet: {
        type: Sequelize.INTEGER,
      },
      siap_komitmen_mengaji: {
        type: Sequelize.INTEGER,
      },
      siap_komitmen_infak: {
        type: Sequelize.INTEGER,
      },
      bersedia_bayar_20K: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pesertas');
  },
};
