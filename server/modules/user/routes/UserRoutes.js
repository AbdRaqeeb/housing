import {Router} from 'express';
import verify from "../../../middleware/verify";
import UserController from "../controllers/UserController";

const router = Router();
const {registerUser, changePassword, updateProfile, uploadProfilePhoto, verifyEmail, forgotPassword, resetPassword} = UserController;

router.post('/forgot-password', forgotPassword);
router.post('/', registerUser);
router.put('/reset-password/:token', resetPassword);
router.put('/upload', verify, uploadProfilePhoto);
router.put('/password', verify, changePassword);
router.get('/verify/:token', verifyEmail);
router.put('/', verify, updateProfile);

export default router;