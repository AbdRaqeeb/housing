'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Tour, User, Property}) {
            // define association here
            Payment.belongsTo(Tour, {
                foreignKey: 'tour_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Payment.belongsTo(User, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Payment.belongsTo(Property, {
                foreignKey: 'property_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    }

    Payment.init({
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        tour_id: {
            type: DataTypes.INTEGER,
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
        modelName: 'Payment',
    });
    return Payment;
};