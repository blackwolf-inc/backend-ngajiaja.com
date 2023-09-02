'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pengajars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      level: {
        type: Sequelize.STRING,
      },
      pendidikan_terakhir: {
        type: Sequelize.STRING,
      },
      punya_sertifikasi_guru_quran: {
        type: Sequelize.INTEGER,
      },
      pengalaman_mengajar: {
        type: Sequelize.STRING,
      },
      pernah_mengajar_online: {
        type: Sequelize.INTEGER,
      },
      paham_aplikasi_meet: {
        type: Sequelize.INTEGER,
      },
      siap_komitmen: {
        type: Sequelize.INTEGER,
      },
      mengajar_hari_libur: {
        type: Sequelize.INTEGER,
      },
      bagi_hasil_50persen: {
        type: Sequelize.INTEGER,
      },
      isVerifiedByAdmin: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      link_video_membaca_quran: {
        type: Sequelize.STRING,
      },
      link_video_simulasi_mengajar: {
        type: Sequelize.STRING,
      },
      tanggal_wawancara: {
        type: Sequelize.DATEONLY,
      },
      jam_wawancara: {
        type: Sequelize.TIME,
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
    await queryInterface.dropTable('Pengajars');
  },
};
