import transferenceController from '../controllers/transferences.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router.post('/:idSenderAccount/:idRecivedAccount', auth, transferenceController.addTransference).get('/', auth, transferenceController.getAllTransferences);
export default router;
