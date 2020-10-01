'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Properties', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            status: {
                type: Sequelize.ENUM({
                    values: ['rent', 'sale']
                })
            },
            room: {
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.ENUM({
                    values: ['house', 'shop', 'office']
                })
            },
            price: {
                type: Sequelize.DECIMAL(10, 2)
            },
            area: {
                type: Sequelize.STRING
            },
            amenities: {
                type: Sequelize.ARRAY(Sequelize.STRING)
            },
            isAvailable: {
                type: Sequelize.BOOLEAN
            },
            images: {
                type: Sequelize.ARRAY(Sequelize.STRING)
            },
            property_id: {
                type: Sequelize.INTEGER
            },
            reference: {
                type: Sequelize.STRING
            },
            isPaid: {
                type: Sequelize.BOOLEAN
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Properties');
    }
};