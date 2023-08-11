'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Student.init(
    {
      user_id: DataTypes.INTEGER,
      profesi: DataTypes.STRING,
      bisa_baca_ayat: DataTypes.STRING,
      menguasai_ilmu_tajwid: DataTypes.INTEGER,
      jadwal_bimbingan: DataTypes.DATE,
      paham_aplikasi_meet: DataTypes.INTEGER,
      siap_komitmen_mengaji: DataTypes.INTEGER,
      siap_komitmen_infak: DataTypes.INTEGER,
      bersedia_bayar_20K: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'Students',
      modelName: 'Student',
    }
  );
  return Student;
};
