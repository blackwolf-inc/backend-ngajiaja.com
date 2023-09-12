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
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([queryInterface.removeIndex('Users', 'email_index')]);
  },
};
