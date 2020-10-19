import {Router} from 'express';
import AuthController from "../controllers/AuthController";
import verify from "../../../middleware/verify";

const router = Router();
const {loginUser, loginAdmin, loggedUser, loggedAdmin} = AuthController;

router.post('/admin', loginAdmin);
router.post('/', loginUser);
router.get('/admin', verify, loggedAdmin);
router.get('/', verify, loggedUser);

export default router;