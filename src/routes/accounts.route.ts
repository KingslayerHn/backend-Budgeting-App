import accountController from '../controllers/account.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router
  .post('/', auth, accountController.addAccount)
  .get('/', auth, accountController.getAllUserAccounts)
  .delete('/:id', auth, accountController.removeAccount)
  .put('/:id', auth, accountController.debit);

export default router;
