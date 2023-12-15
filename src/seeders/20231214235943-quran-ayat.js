'use strict';
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = JSON.parse(fs.readFileSync('src/seeders/data/quran-ayat.json', 'utf-8'));

    const quranAyatData = data.map(item => {
      return {
        ...item
      };
    });

    await queryInterface.bulkInsert('QuranAyat', quranAyatData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('QuranAyat', null, {});
  }
};