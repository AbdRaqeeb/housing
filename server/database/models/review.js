'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Property}) {
            // define association here
            Review.belongsTo(Property, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    Review.init({
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
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
        review: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Review',
    });
    return Review;
};