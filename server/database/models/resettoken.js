'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ResetToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };

    ResetToken.init({
        email: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.STRING
        },
        expiration: {
            type: DataTypes.DATE
        },
        used: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'ResetToken',
    });
    return ResetToken;
};