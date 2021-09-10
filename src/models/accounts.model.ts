import { Schema, model } from 'mongoose';
import AccountInterface from '../interfaces/accounts.interface';

export const AccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
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

const Account = model<AccountInterface>('accounts', AccountSchema);
export default Account;
