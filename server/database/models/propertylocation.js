'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PropertyLocation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Property}) {
            // define association here
            PropertyLocation.belongsTo(Property, {
                foreignKey: 'property_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    }

    PropertyLocation.init({
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PropertyLocation',
    });
    return PropertyLocation;
};