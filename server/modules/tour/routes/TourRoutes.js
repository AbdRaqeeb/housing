import {Router} from 'express';
import TourController from "../controllers/TourController";
import {authorize} from "../../../middleware/authorize";
import verify from "../../../middleware/verify";
import {checkCache} from "../../../middleware/cache";
import roles from "../../../helpers/roles";

const router = Router();
const {bookTour, deleteTour, getTour, getTours, getUserTours, updateTour, viewUserTours} = TourController;

router.post('/', bookTour);
router.get('/user/:id', [verify, authorize(roles.Admin)], viewUserTours);
router.get('/user', verify, getUserTours);
router.get('/:id', [verify, checkCache], getTour);
router.get('/', [verify, authorize(roles.Admin)], getTours);
router.put('/:id', [verify, authorize(roles.Admin)], updateTour);
router.delete('/:id', [verify, authorize(roles.Admin)], deleteTour);

export default router;