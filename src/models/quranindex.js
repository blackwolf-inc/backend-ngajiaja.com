'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuranIndex extends Model {
        static associate(models) {
            QuranIndex.hasMany(models.QuranAyat, {
                foreignKey: 'id_surat',
                as: 'surat',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    QuranIndex.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        no_surat: DataTypes.INTEGER,
        nama_surat: DataTypes.STRING,
        turun_di: DataTypes.STRING,
        arti_surat: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'QuranIndex',
        tableName: 'QuranIndex',
    });

    return QuranIndex;
};