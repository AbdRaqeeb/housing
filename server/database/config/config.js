require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        dialect: 'postgres'
    },
    test: {
        username: process.env.TEST_DATABASE_USER,
        password: process.env.TEST_DATABASE_PASSWORD,
        database: process.env.TEST_DATABASE,
        host: process.env.TEST_DATABASE_HOST,
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
        logging: false,
    },
};