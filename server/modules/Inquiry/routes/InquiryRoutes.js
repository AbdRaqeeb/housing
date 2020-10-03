import {Router} from 'express';
import InquiryController from "../controllers/InquiryController";
import verify from "../../../middleware/verify";
import {authorize} from "../../../middleware/authorize";
import roles from "../../../helpers/roles";

const router = Router();
const {makeInquiry, deleteInquiry, getInquiries, getInquiry, getUserInquiries, updateInquiry, viewUserInquiries} = InquiryController;

router.post('/', makeInquiry);
router.get('/user/:id', [verify, authorize(roles.Admin)], viewUserInquiries);
router.get('/user', verify, getUserInquiries);
router.get('/:id', [verify, authorize([roles.Admin, roles.User])], getInquiry);
router.get('/', [verify, authorize(roles.Admin)], getInquiries);
router.put('/:id', [verify, authorize(roles.Admin)], updateInquiry);
router.delete('/:id', [verify, authorize(roles.Admin)], deleteInquiry);

export default router;