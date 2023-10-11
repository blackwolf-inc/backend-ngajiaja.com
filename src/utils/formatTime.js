const moment = require('moment-timezone');
const id = require('moment/locale/id'); // Import bahasa Indonesia untuk moment

moment.updateLocale('id', id); // Perbarui pengaturan bahasa untuk Bahasa Indonesia

function format(tanggalWaktuISO) {
  return moment(tanggalWaktuISO).tz('Asia/Jakarta').format('dddd, DD MMMM YYYY - HH.mm [wib]');
}

module.exports = format;
