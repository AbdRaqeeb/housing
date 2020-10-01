import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {config} from 'cloudinary-simple-upload';
import 'dotenv/config';

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


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Housing server running on port ${PORT}`);
});