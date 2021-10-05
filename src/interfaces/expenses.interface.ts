import { Schema, Document } from 'mongoose';
export default interface ExpensesInterface extends Document {
  user: Schema.Types.ObjectId;
  account: Schema.Types.ObjectId;
  description: String;
  amount: Number;
  day: Number;
  month: Number;
  hour: Number;
  minutes: Number;
  createAt: Date;
}
