import {Router} from 'express';
import PropertyController from "../controllers/PropertyController";
import {authorize} from "../../../middleware/authorize";
import verify from "../../../middleware/verify";
import {checkCache} from "../../../middleware/cache";
import roles from "../../../helpers/roles";

const router = Router();
const {
    addProperty,
    deleteProperty,
    getProperties,
    getProperty,
    getUserProperties,
    paidProperty,
    updateProperty,
    viewUserProperties
} = PropertyController;

router.post('/', verify, addProperty);
router.get('/user/:id', checkCache, viewUserProperties);
router.get('/user', verify, getUserProperties);
router.get('/:id', checkCache, getProperty);
router.get('/', checkCache, getProperties);
router.put('/paid/:id', [verify, authorize(roles.Admin)], paidProperty);
router.put('/:id', verify, updateProperty);
router.delete('/:id', [verify, authorize(roles.Admin)], deleteProperty);

export default router;