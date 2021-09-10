import { Schema, model } from 'mongoose';
import ExpensesInterface from '../interfaces/expenses.interface';

export const ExpenseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'accounts'
  },

  description: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    require: true,
    default: 0
  },

  createAt: {
    type: Date,
    default: Date.now
  }
});

const Expense = model<ExpensesInterface>('expenses', ExpenseSchema);
export default Expense;
