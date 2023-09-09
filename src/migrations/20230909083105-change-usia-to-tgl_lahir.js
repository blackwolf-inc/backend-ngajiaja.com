'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'usia');
    await queryInterface.addColumn('Users', 'tgl_lahir', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'tgl_lahir');
    await queryInterface.addColumn('Users', 'usia', {
      type: Sequelize.INTEGER,
    });
  },
};
