'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PenghasilanPengajars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pengajar_id: {
        type: Sequelize.INTEGER,
      },
      peserta_id: {
        type: Sequelize.INTEGER,
      },
      pembayaran: {
        type: Sequelize.DOUBLE,
      },
      penghasilan: {
        type: Sequelize.DOUBLE,
      },
      persentase_bagi_hasil: {
        type: Sequelize.FLOAT,
      },
      waktu_pembayaran: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('PenghasilanPengajars');
  },
};
