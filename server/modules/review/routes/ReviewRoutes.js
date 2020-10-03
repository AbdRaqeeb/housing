import {Router} from 'express';
import ReviewController from "../controllers/ReviewController";
import {authorize} from "../../../middleware/authorize";
import {checkCache} from "../../../middleware/cache";
import verify from "../../../middleware/verify";
import roles from "../../../helpers/roles";

const router = Router();
const {addReview, deleteReview, getPropertyReviews, getReview, getReviews} = ReviewController;

router.post('/', addReview);
router.get('/property/:id', getPropertyReviews);
router.get('/:id', checkCache, getReview);
router.get('/', getReviews);
router.delete('/:id', [verify, authorize(roles.Admin)], deleteReview);

export default router;