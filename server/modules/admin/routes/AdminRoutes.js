import {Router} from 'express';
import AdminController from "../controllers/AdminController";
import verify from "../../../middleware/verify";

const router = Router();
const {registerAdmin, uploadProfilePhoto, changePassword, updateProfile} = AdminController;

router.post('/', registerAdmin);
router.put('/upload', verify, uploadProfilePhoto);
router.put('/password', verify, changePassword);
router.put('/', verify, updateProfile);

export default router;