import {Router} from 'express';
import AuthController from "../controllers/AuthController";

const router = Router();
const {loginUser, loginAdmin, loggedUser, loggedAdmin} = AuthController;

router.post('/admin', loginAdmin);
router.post('/', loginUser);
router.get('/admin', loggedAdmin);
router.get('/', loggedUser);

export default router;