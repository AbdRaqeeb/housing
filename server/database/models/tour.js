'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tour extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Property, User, Payment}) {
            // define association here
            Tour.belongsTo(Property, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            Tour.belongsTo(User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            Tour.hasOne(Payment, {
                foreignKey: 'tour_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

        }
    }

    Tour.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        charges: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
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
        modelName: 'Tour',
    });
    return Tour;
};