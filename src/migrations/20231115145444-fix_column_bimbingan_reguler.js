'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn('BimbinganRegulers', 'link_meet', {
    //   type: Sequelize.STRING, // Tipe data kolom
    //   allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    // });
    await queryInterface.addColumn('BimbinganRegulers', 'tanggal_baru', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('BimbinganRegulers', 'jam_baru', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('BimbinganRegulers', 'persetujuan_peserta', {
      type: Sequelize.INTEGER, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('BimbinganRegulers', 'link_meet');
    await queryInterface.removeColumn('BimbinganRegulers', 'tanggal_baru');
    await queryInterface.removeColumn('BimbinganRegulers', 'jam_baru');
    await queryInterface.removeColumn('BimbinganRegulers', 'persetujuan_peserta');
  },
};
