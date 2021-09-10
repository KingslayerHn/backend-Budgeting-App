import { Schema, Document } from 'mongoose';
export default interface AccountInterface extends Document {
  user: Schema.Types.ObjectId;
  description: string;
  amount: Number;
  createAt: Date;
}
