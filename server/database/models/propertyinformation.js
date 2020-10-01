'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PropertyInformation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Property}) {
            // define association here
            PropertyInformation.belongsTo(Property, {
                foreignKey: 'property_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    }

    PropertyInformation.init({
        build_age: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bedrooms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        BQ: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'PropertyInformation',
    });
    return PropertyInformation;
};