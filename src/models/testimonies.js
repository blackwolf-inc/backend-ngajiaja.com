'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Testimonies extends Model {
        static associate(models) {
        }
    }
    Testimonies.init(
        {
            testimony_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            testimony_name: DataTypes.STRING,
            testimony_body: DataTypes.STRING,
            testimony_profession: DataTypes.STRING,
            testimony_picture: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Testimonies',
        },
    );
    return Testimonies;
};
