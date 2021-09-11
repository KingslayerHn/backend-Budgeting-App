import IncomeController from '../controllers/income.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router.post('/:id', auth, IncomeController.addIncome).get('/', auth, IncomeController.getAllIncomes);
export default router;
