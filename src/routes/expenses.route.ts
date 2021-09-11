import expenseController from '../controllers/expenses.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router.post('/:id', auth, expenseController.addExpense).get('/', auth, expenseController.getAllExpenses);
export default router;
