const PilihPengajarService = require('../service/pilihPengajar.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { STATUS_PERIOD, STATUS_JADWAL_PENGAJAR } = require('../../../helpers/constanta');
const { Period, BimbinganTambahan, Pengajar } = db;

class PilihPengajar {
  static async getAll(req, res, next) {
    // const service = new PilihPengajarService(req, JadwalMengajarPengajar);
    const service = new PilihPengajarService(req, Pengajar);
    try {
      const result = await service.getAllPengajar(
        req.query.hari_1,
        req.query.jam_1,
        req.query.hari_2,
        req.query.jam_2
      );
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    const service = new PilihPengajarService(req, Pengajar);
    try {
      const result = await service.getOnepengajarByTeacherId(req.params.id);
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new PilihPengajarService(req, Period);
    try {
      const periode = await service.createPeriode(req.body);
      const result = await service.createBimbinganReguler(
        periode.id,
        req.body.tanggal_pengingat_infaq,
        req.body.hari_1,
        req.body.jam_1,
        req.body.hari_2,
        req.body.jam_2
      );
      return responseHandler.succes(res, `Success crete data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new PilihPengajarService(req, Period);
    const user = req.user;
    // const user = {
    //   id: 23,
    // };

    try {
      if (req.body.status === STATUS_PERIOD.ACTIVATED) {
        //check apakah ada jadwal yang sama
        await service.checkJadwalDuplicate(user.id, req.params.id);
        //update status jadwalMengajarPengajar menjadi inactive saat di acc
        await service.autoUpdate(user.id, req.params.id, STATUS_JADWAL_PENGAJAR.INACTIVE);
      }

      //update status jadwalMengajarPengajar menjadi active saat bimbingan finished
      if (req.body.status === STATUS_PERIOD.FINISHED) {
        await service.autoUpdate(user.id, req.params.id, STATUS_JADWAL_PENGAJAR.ACTIVE);
      }

      const result = await service.updateData(req.body, req.params);
      return responseHandler.succes(res, `Success update ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new PilihPengajarService(req, Period);
    try {
      const result = await service.deleteData(req.params);
      return responseHandler.succes(res, `Success delete ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  // static async createTambahan(req, res, next) {
  //   const service = new PilihPengajarService(req, BimbinganTambahan);
  //   try {
  //     const period = await service.createPeriode(req.body);
  //     const result = await service.createBimbinganTambahan(
  //       period.id,
  //       req.body.hari_bimbingan,
  //       req.body.jam_bimbingan
  //     );
  //     return responseHandler.succes(res, `Success create ${service.db.name}`, result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async createTambahan(req, res, next) {
    const service = new PilihPengajarService(req, Period);
    try {
      const period = await service.createPeriode(req.body);
      console.log(period);
      const result = await service.createBimbinganTambahan(
        period.id,
        req.body.hari_1,
        req.body.jam_1,
        req.body.hari_2,
        req.body.jam_2
      );
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async testDays(req, res, next) {
    const service = new PilihPengajarService();
    const user = req.user;
    try {
      const result = await service.checkJadwalDuplicate(user.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PilihPengajar;
