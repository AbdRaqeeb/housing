import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {config} from 'cloudinary-simple-upload';
import 'dotenv/config';
import {error} from "./middleware/error";

// import modules
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import AuthRoutes from './modules/auth/routes/AuthRoutes';
import UserRoutes from './modules/user/routes/UserRoutes';
import PropertyRoutes from './modules/property/routes/PropertyRoutes';
import InquiryRoutes from './modules/inquiry/routes/InquiryRoutes';
import TourRoutes from './modules/tour/routes/TourRoutes';
import ReviewRoutes from './modules/review/routes/ReviewRoutes';

const app = express();
app.use(express.json({extended: false}));
app.use(cors());
app.use(fileUpload({
    limit: {
        fileSize: 10 * 1024 * 1024
    }
}));

// Cloudinary API KEY
config(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);


app.use('/api/v1/admin', AdminRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/property', PropertyRoutes);
app.use('/api/v1/inquiry', InquiryRoutes);
app.use('/api/v1/tour', TourRoutes);
app.use('/api/v1/review', ReviewRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the housing app');
});

app.get('*', (req, res) => {
    res.status(404).send('Page not found')
});

app.use(error);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Housing server running on port ${PORT}`);
});