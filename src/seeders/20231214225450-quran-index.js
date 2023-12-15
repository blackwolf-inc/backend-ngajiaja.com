'use strict';
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = JSON.parse(fs.readFileSync('src/seeders/data/quran-index.json', 'utf-8'));

    const quranIndexData = data.map(item => {
      return {
        ...item
      };
    });

    await queryInterface.bulkInsert('QuranIndex', quranIndexData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('QuranIndex', null, {});
  }
};