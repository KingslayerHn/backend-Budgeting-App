import { Schema, Document } from 'mongoose';
export default interface TransferenceInterface extends Document {
  user: Schema.Types.ObjectId;
  senderAmount: Number;
  description: String;
  idSenderAccount: Schema.Types.ObjectId;
  idRecivedAccount: Schema.Types.ObjectId;
  day: Number;
  month: Number;
  hour: Number;
  minutes: Number;
  createAt: Date;
}
