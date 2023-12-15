'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuranAyat extends Model {
        static associate(models) {
            QuranAyat.belongsTo(models.QuranIndex, {
                foreignKey: 'no_surat',
                as: 'surat',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    QuranAyat.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_surat: DataTypes.INTEGER,
        no_ayat: DataTypes.INTEGER,
        ayat: DataTypes.TEXT('long'),
        terjemahan: DataTypes.TEXT('long'),
        keterangan: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'QuranAyat',
        tableName: 'QuranAyat',
    });

    return QuranAyat;
};