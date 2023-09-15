class BaseRepository {
  constructor(req, db) {
    this.db = db;
    this.req = req;
  }

  async jsonParseHandler(data) {
    let stringifyData = JSON.stringify(data);
    return JSON.parse(stringifyData);
  }

  async __findOne(query) {
    let data = await this.db.findOne(query);
    return this.jsonParseHandler(data);
  }

  async __findAll(query, fieldOrder = 'updatedAt', ascDescOrder = 'DESC') {
    let { paginate, page } = this.req.query;
    let paginationCondition;

    if (paginate && page) {
      paginationCondition = {
        limit: Number(paginate),
        offset: Number(page - 1) * Number(paginate),
      };
    } else {
      paginationCondition = {};
    }

    const [datas, total_datas] = await Promise.all([
      this.db.findAll({
        ...query,
        ...paginationCondition,
        order: [[fieldOrder, ascDescOrder]],
      }),
      this.db.findAll({
        ...query,
        order: [[fieldOrder, ascDescOrder]],
      }),
    ]);

    const [resultDatas, resultTotalDatas] = await Promise.all([
      this.jsonParseHandler(datas),
      this.jsonParseHandler(total_datas),
    ]);

    return {
      total: resultTotalDatas.length,
      datas: resultDatas,
    };
  }

  async __create(payload, transaction) {
    const createdData = await this.db.create(payload, transaction);
    return this.jsonParseHandler(createdData);
  }

  /* payload is array */
  async __createBulk(payload, transaction) {
    return this.db.bulkCreate(payload, transaction);
  }

  async __update(payload, query, transaction) {
    return this.db.update(payload, query, transaction);
  }

  async __remove(query, transaction) {
    return this.db.destroy(query, transaction);
  }
}

module.exports = BaseRepository;
