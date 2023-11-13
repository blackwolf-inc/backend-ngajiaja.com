var moment = require('moment');
const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const {
  Period,
  BimbinganReguler,
  BimbinganTambahan,
  Pengajar,
  JadwalMengajarPengajar,
  User,
  sequelize,
} = require('../../../models');
const { Op } = require('sequelize');
const { STATUS_JADWAL_PENGAJAR } = require('../../../helpers/constanta');
const { QueryTypes } = require('sequelize');
class PilihPengajar extends BaseService {
  async checkDays(hari_1, hari_2) {
    const arrayDays = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'];
    let indexDay1 = 0;
    let indexDay2 = 0;

    let days = '';

    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        days = hari_1;
      } else {
        days = hari_2;
      }

      for (let i = 0; i < arrayDays.length; i++) {
        if (arrayDays[i] == hari_1) {
          indexDay1 = i;
        } else if (arrayDays[i] == hari_2) {
          indexDay2 = i;
        }
      }
      if (indexDay1 > indexDay2) {
        throw ApiError.badRequest(`Invalid date first day: ${hari_1} > last day: ${hari_2}`);
      }
    }
  }

  async getAllPengajar(hari_1, jam_1, hari_2, jam_2) {
    const pengajarList = await Pengajar.findAll({
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: JadwalMengajarPengajar,
          required: true,
          as: 'jadwal_mengajar',
          where: {
            [Op.and]: [
              { hari_mengajar: { [Op.in]: [hari_1, hari_2] } },
              { mulai_mengajar: { [Op.in]: [jam_1, jam_2] } },
              { status: STATUS_JADWAL_PENGAJAR.ACTIVE },
            ],
          },
        },
      ],
    });

    const result = pengajarList.map((pengajar) => {
      return {
        id_pengajar: pengajar.id,
        nama: pengajar.user.nama, // Sesuaikan dengan atribut yang ingin ditampilkan di frontend
        jenis_kelamin: pengajar.user.jenis_kelamin,
        jadwalActive: pengajar.jadwal_mengajar ? pengajar.jadwal_mengajar.length : 0,
      };
    });

    return result;
  }

  async createPeriode(payload) {
    await this.checkDays(payload.hari_1, payload.hari_2);
    const createPeriod = await this.__create(payload);

    return createPeriod;
  }

  async createBimbinganReguler(id, tanggal_pengingat_infaq, hari_1, jam_1, hari_2, jam_2) {
    const records = [];
    const dateNow = moment(new Date()).format('YYYY-MM-DD');
    const dateVerifikasi = moment(dateNow).add('days', 4).format('YYYY-MM-DD');
    // const dateEnd = moment(dateVerifikasi).endOf('month').format('YYYY-MM-DD');
    const dateRemember = moment(tanggal_pengingat_infaq).format('YYYY-MM-DD');
    const dateDiff = 30;

    let dateThisMonth = dateVerifikasi;
    for (let i = 1; i <= dateDiff; i++) {
      if (hari_1 == moment(dateThisMonth).format('dddd')?.toUpperCase()) {
        const query = {
          period_id: id,
          tanggal_pengingat_infaq: dateRemember,
          tanggal: moment(dateThisMonth).format('YYYY-MM-DD'),
          hari_bimbingan: hari_1,
          jam_bimbingan: jam_1,
        };
        const result = await BimbinganReguler.create(query);
        records.push(result);
        dateThisMonth = moment(dateThisMonth).add('days', 1).format('YYYY-MM-DD');
      } else if (hari_2 == moment(dateThisMonth).format('dddd')?.toUpperCase()) {
        const query = {
          period_id: id,
          tanggal_pengingat_infaq: dateRemember,
          tanggal: moment(dateThisMonth).format('YYYY-MM-DD'),
          hari_bimbingan: hari_2,
          jam_bimbingan: jam_2,
        };
        const result = await BimbinganReguler.create(query);
        records.push(result);
        dateThisMonth = moment(dateThisMonth).add('days', 1).format('YYYY-MM-DD');
      } else {
        dateThisMonth = moment(dateThisMonth).add('days', 1).format('YYYY-MM-DD');
      }
    }

    return records;
  }

  async createBimbinganTambahan(id, hari_bimbingan, jam_bimbingan) {
    const query = {
      period_id: id,
      hari_bimbingan,
      jam_bimbingan,
    };

    const result = await BimbinganTambahan.create(query);

    return result;
  }

  async checkJadwalDuplicate(user_id, period_id) {
    const idPengajar = await sequelize.query(
      `
      SELECT id
      FROM Pengajars
      WHERE user_id = :userId
    `,
      {
        replacements: { userId: user_id },
        type: QueryTypes.SELECT,
      }
    );

    const getPeriod = await sequelize.query(
      `
      SELECT *
      FROM Periods
      WHERE id = :periodId
      `,
      {
        replacements: { periodId: period_id },
        type: QueryTypes.SELECT,
      }
    );

    // Get hari & jam pada period
    let [hari_1, jam_1, hari_2, jam_2] = await Promise.all([
      getPeriod[0].hari_1,
      `${getPeriod[0].jam_1.split('-')[0]}:00`,
      getPeriod[0].hari_2,
      `${getPeriod[0].jam_2.split('-')[0]}:00`,
    ]);

    const checkHariJam1Exist = await JadwalMengajarPengajar.findOne({
      where: {
        pengajar_id: idPengajar[0].id,
        hari_mengajar: hari_1,
        mulai_mengajar: jam_1,
        status: STATUS_JADWAL_PENGAJAR.INACTIVE,
      },
    });

    if (checkHariJam1Exist) {
      throw ApiError.badRequest(`Jadwal hari ${hari_1} / ${getPeriod[0].jam_1} sudah terisi!`);
    }

    const checkHariJam2Exist = await JadwalMengajarPengajar.findOne({
      where: {
        pengajar_id: idPengajar[0].id,
        hari_mengajar: hari_2,
        mulai_mengajar: jam_2,
        status: STATUS_JADWAL_PENGAJAR.INACTIVE,
      },
    });

    if (checkHariJam2Exist) {
      throw ApiError.badRequest(`Jadwal hari ${hari_2} / ${getPeriod[0].jam_2} sudah terisi!`);
    }
    console.log(jam_1);
    console.log(hari_2);
    console.log(jam_2);
  }

  async autoUpdate(user_id, period_id, status) {
    const idPengajar = await sequelize.query(
      `
      SELECT id
      FROM Pengajars
      WHERE user_id = :userId
    `,
      {
        replacements: { userId: user_id },
        type: QueryTypes.SELECT,
      }
    );

    const getPeriod = await sequelize.query(
      `
      SELECT *
      FROM Periods
      WHERE id = :periodId
      `,
      {
        replacements: { periodId: period_id },
        type: QueryTypes.SELECT,
      }
    );

    // Get hari & jam pada period
    let [hari_1, jam_1, hari_2, jam_2] = await Promise.all([
      getPeriod[0].hari_1,
      `${getPeriod[0].jam_1.split('-')[0]}:00`,
      getPeriod[0].hari_2,
      `${getPeriod[0].jam_2.split('-')[0]}:00`,
    ]);

    //Get id jadwal mengajar
    let [idJadwalMengajar1, idJadwalMengajar2] = await Promise.all([
      sequelize.query(
        `
        SELECT *
        FROM JadwalMengajarPengajars
        WHERE pengajar_id = :pengajarId AND hari_mengajar = :hari1 AND mulai_mengajar = :jam1 
        `,
        {
          replacements: { pengajarId: idPengajar[0].id, hari1: hari_1, jam1: jam_1 },
          type: QueryTypes.SELECT,
        }
      ),
      sequelize.query(
        `
        SELECT *
        FROM JadwalMengajarPengajars
        WHERE pengajar_id = :pengajarId AND hari_mengajar = :hari2 AND mulai_mengajar = :jam2
        `,
        {
          replacements: { pengajarId: idPengajar[0].id, hari2: hari_2, jam2: jam_2 },
          type: QueryTypes.SELECT,
        }
      ),
    ]);

    console.log(idJadwalMengajar1[0].id);
    console.log(idJadwalMengajar2[0].id);

    const updateHari1 = await sequelize.transaction(async (t) => {
      const data = await JadwalMengajarPengajar.update(
        { status: status },
        {
          where: {
            pengajar_id: idPengajar[0].id,
            hari_mengajar: hari_1,
            mulai_mengajar: jam_1,
          },
        },
        { transaction: t }
      );

      if (data.length > 0) {
        const afterUpdateData = await JadwalMengajarPengajar.findOne({
          where: { id: idJadwalMengajar1[0].id },
        });
        return afterUpdateData;
      } else {
        throw new Error(`Failed update`);
      }
    });

    const updateHari2 = await sequelize.transaction(async (t) => {
      const data = await JadwalMengajarPengajar.update(
        { status: status },
        {
          where: {
            pengajar_id: idPengajar[0].id,
            hari_mengajar: hari_2,
            mulai_mengajar: jam_2,
          },
        },
        { transaction: t }
      );

      if (data.length > 0) {
        const afterUpdateData = await JadwalMengajarPengajar.findOne({
          where: { id: idJadwalMengajar2[0].id },
        });
        return afterUpdateData;
      } else {
        throw new Error(`Failed update`);
      }
    });

    return { updateHari1, updateHari2 };
  }

  // async updateTanggal(id) {
  //   const prefDaysSet = new Set();
  //   const userPrefDays = await Period.findOne({
  //     where: { id },
  //     include: [
  //       {
  //         model: BimbinganReguler,
  //         as: 'bimbingan_reguler',
  //       },
  //     ],
  //   });

  //   userPrefDays.bimbingan_reguler.forEach((element) => {
  //     prefDaysSet.add(element.hari_bimbingan);
  //   });

  //   const arrayDaysSet = Array.from(prefDaysSet);

  //   const userPrefDay1 = arrayDaysSet[0];
  //   const userPrefDay2 = arrayDaysSet[1];

  //   // return {
  //   //   userPrefDay1,
  //   //   userPrefDay2,
  //   // };
  //   // const mentorAcceptanceDay = new Date();
  // }

  #includeQuery = [
    {
      model: Pengajar,
      as: 'pengajar',
      include: [
        {
          model: JadwalMengajarPengajar,
          as: 'jadwal_mengajar',
        },
      ],
    },
  ];

  #includeQueryFilter = [
    {
      model: Pengajar,
      as: 'pengajar',
    },
  ];
}

module.exports = PilihPengajar;
