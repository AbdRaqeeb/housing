'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inquiry extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Property, User}) {
            // define association here
            Inquiry.belongsTo(Property, {
                foreignKey: 'property_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Inquiry.belongsTo(User, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    }

    Inquiry.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Inquiry',
    });
    return Inquiry;
};