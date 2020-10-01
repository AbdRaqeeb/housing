import redis from 'redis';

// Redis port
const redis_port = process.env.REDIS_PORT || 6565;

/**
 * IN PRODUCTION
 * */
// // Initiate redis client
// const redis_client = redis.createClient(redis_port, process.env.REDIS_HOST);
//
// redis_client.auth(process.env.REDIS_PASSWORD, () => {
//     console.log('Redis database connected');
// });

/**
 * IN DEVELOPMENT
 * */
const redis_client = redis.createClient(redis_port);


export async function addToCache(id, data) {
    await redis_client.setex(id, 3600, JSON.stringify(data));
    console.log('data added to cache');
}

export async function checkCache(req, res, next) {
    const id = req.originalUrl;
    await redis_client.get(id, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error')
        }

        if (data == null) {
            next();
        } else {
            console.log('DATA retrieved from cache');
            res.status(200).json(JSON.parse(data));
        }
    });
}
