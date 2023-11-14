const USER_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  PENGAJAR: 'PENGAJAR',
  PESERTA: 'PESERTA',
};

const STATUS_USER = {
  REGISTERED: 'REGISTERED',
  ADMINISTRATION: 'ADMINISTRATION',
  WAITING: 'WAITING',
  INTERVIEWED: 'INTERVIEWED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  NONACTIVE: 'NONACTIVE',
};

const LEVEL_PESERTA = {
  BEGINNER: 'BEGINNER',
  ELEMENTARY: 'ELEMENTARY',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
};

const TYPE_BIMBINGAN = {
  REGULER: 'REGULER',
  TAMBAHAN: 'TAMBAHAN',
};

const STATUS_BIMBINGAN = {
  WAITING: 'WAITING',
  ACTIVATED: 'ACTIVATED',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  INFAQ_UNPAID: 'INFAQ_UNPAID',
};

const STATUS_JADWAL_PENGAJAR = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const STATUS_PERIOD = {
  WAITING: 'WAITING',
  INFAQ_UNPAD: 'INFAQ_UNPAD',
  ACTIVATED: 'ACTIVATED',
  CANCELED: 'CANCELED',
  FINISHED: 'FINISHED',
};

const STATUS_JADWAL = {
  BIMBINGAN: 'BIMBINGAN',
  AVAILABLE: 'TERSEDIA',
};

const STATUS_PENCAIRAN = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

const STATUS_INFAQ = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

module.exports = {
  USER_ROLE,
  STATUS_USER,
  TYPE_BIMBINGAN,
  STATUS_BIMBINGAN,
  LEVEL_PESERTA,
  STATUS_JADWAL_PENGAJAR,
  STATUS_PERIOD,
  STATUS_JADWAL,
  STATUS_PENCAIRAN,
  STATUS_INFAQ,
};
