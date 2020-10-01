'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Property, Tour, Inquiry}) {
            // define association here
            User.hasMany(Property, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            User.hasMany(Tour, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            User.hasMany(Inquiry, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }
    };
    User.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
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
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 6
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};