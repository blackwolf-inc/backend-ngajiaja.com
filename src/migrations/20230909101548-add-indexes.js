'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addIndex('Users', {
        fields: [
          {
            name: 'email',
          },
        ],
        type: 'UNIQUE',
        name: 'email_index',
      }),
      queryInterface.addIndex('Pengajars', {
        fields: [
          {
            name: 'user_id',
            order: 'ASC',
          },
        ],
        type: 'UNIQUE',
        name: 'user_id_index',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeIndex('Users', 'email_index'),
      queryInterface.removeIndex('Pengajars', 'user_id_index'),
    ]);
  },
};
