import { Schema, model } from 'mongoose';
import IncomeInterface from '../interfaces/income.interface';

export const IncomeSchema = new Schema({
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

const Incomes = model<IncomeInterface>('incomes', IncomeSchema);
export default Incomes;
