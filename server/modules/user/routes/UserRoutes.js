import {Router} from 'express';
import verify from "../../../middleware/verify";
import UserController from "../controllers/UserController";

const router = Router();
const {registerUser, changePassword, updateProfile, uploadProfilePhoto, verifyEmail} = UserController;

router.post('/', registerUser);
router.put('/upload', verify, uploadProfilePhoto);
router.put('/password', verify, changePassword);
router.put('/verify/:id', verifyEmail);
router.put('/', verify, updateProfile);

export default router;