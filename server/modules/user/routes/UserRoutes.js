import {Router} from 'express';
import verify from "../../../middleware/verify";
import UserController from "../controllers/UserController";

const router = Router();
const {registerCustomer, changePassword, updateProfile, uploadProfilePhoto} = UserController;

router.post('/', registerCustomer);
router.put('/upload', verify, uploadProfilePhoto);
router.put('/password', verify, changePassword);
router.put('/', verify, updateProfile);

export default router;