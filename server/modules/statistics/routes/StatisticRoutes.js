import {Router} from 'express';
import StatisticController from "../controllers/StatisticController";
import verify from "../../../middleware/verify";
import {authorize} from "../../../middleware/authorize";
import {checkCache} from "../../../middleware/cache";
import roles from "../../../helpers/roles";


const router = Router();
const {getUsers, getInquiryCounts, getPayments, getPropertyCounts, getReviewCounts, getTourCounts} = StatisticController;

router.get('/users', [verify, authorize(roles.Admin), checkCache], getUsers);
router.get('/payments', [verify, authorize(roles.Admin)], getPayments);
router.get('/property', [verify, authorize(roles.Admin)], getPropertyCounts);
router.get('/inquiry', [verify, authorize(roles.Admin)], getInquiryCounts);
router.get('/review', [verify, authorize(roles.Admin)], getReviewCounts);
router.get('/tour', [verify, authorize(roles.Admin)], getTourCounts);

export default router;