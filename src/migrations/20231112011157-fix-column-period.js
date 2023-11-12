'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Periods', 'link_meet', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Periods', 'tanggal_pengingat_infaq', {
      type: Sequelize.DATEONLY, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Periods', 'ingatkan_infaq_tiap_2_kali_bimbingan', {
      type: Sequelize.INTEGER, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Periods', 'hari_1', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Periods', 'jam_1', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Periods', 'hari_2', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Periods', 'jam_2', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Periods', 'link_meet');
    await queryInterface.removeColumn('Periods', 'tanggal_pengingat_infaq');
    await queryInterface.removeColumn('Periods', 'ingatkan_infaq_tiap_2_kali_bimbingan');
    await queryInterface.removeColumn('Periods', 'hari_1');
    await queryInterface.removeColumn('Periods', 'jam_1');
    await queryInterface.removeColumn('Periods', 'hari_2');
    await queryInterface.removeColumn('Periods', 'jam_2');
  },
};
