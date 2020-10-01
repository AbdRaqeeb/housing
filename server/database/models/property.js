'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Property extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User, Inquiry, Tour, PropertyInformation, PropertyLocation, Review}) {
            // define association here
            Property.belongsTo(User, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Property.hasMany(Inquiry, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            Property.hasMany(Tour, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            Property.hasOne(PropertyInformation, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            Property.hasOne(PropertyLocation, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            Property.hasMany(Review, {
                foreignKey: 'property_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    };
    Property.init({
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM({
                values: ['rent', 'sale']
            }),
            allowNull: false,
            defaultValue: 'rent',
        },
        room: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        type: {
            type: DataTypes.ENUM({
                values: ['house', 'shop', 'office']
            }),
            allowNull: false,
            defaultValue: 'house'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amenities: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Property',
    });
    return Property;
};