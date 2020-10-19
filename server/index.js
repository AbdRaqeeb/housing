import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {config} from 'cloudinary-simple-upload';
import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {error} from "./middleware/error";
import Models from './database/models';

// import modules
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import AuthRoutes from './modules/auth/routes/AuthRoutes';
import UserRoutes from './modules/user/routes/UserRoutes';
import PropertyRoutes from './modules/property/routes/PropertyRoutes';
import InquiryRoutes from './modules/inquiry/routes/InquiryRoutes';
import TourRoutes from './modules/tour/routes/TourRoutes';
import ReviewRoutes from './modules/review/routes/ReviewRoutes';
import StatisticRoutes from './modules/statistics/routes/StatisticRoutes';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const apiTimeout = 18000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(helmet());
app.use(limiter);
app.use(express.json({extended: false}));
app.use(cors());
app.use(fileUpload({
    limit: {
        fileSize: 10 * 1024 * 1024
    }
}));

// Cloudinary API KEY
config(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);

// Connect to database
Models.sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.log('Unable to sync database', err));


app.use('/api/v1/admin', AdminRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/property', PropertyRoutes);
app.use('/api/v1/inquiry', InquiryRoutes);
app.use('/api/v1/tour', TourRoutes);
app.use('/api/v1/review', ReviewRoutes);
app.use('/api/v1/statistic', StatisticRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the housing app');
});

app.get('*', (req, res) => {
    res.status(404).send('Page not found')
});

app.use((req, res, next) => {
    // set the timeout for all HTTP requests
    req.setTimeout(apiTimeout, () => {
        const err = new Error('Request Timeout');
        err.status = 408;
        next(err);
    });

    // set the server response timeout for all HTTP requests
    res.setTimeout(apiTimeout, () => {
        const err = new Error('Service Unavailable');
        err.status = 503;
        next(err);
    });
    next();
});

app.use(error);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Housing server running on port ${PORT}`);
});