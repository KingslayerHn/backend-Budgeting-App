import { Schema, model } from 'mongoose';
import TransferenceInterface from '../interfaces/tranferences.interface';

export const TransferenceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  idSenderAccount: {
    type: Schema.Types.ObjectId,
    ref: 'accounts'
  },
  idRecivedAccount: {
    type: Schema.Types.ObjectId,
    ref: 'accounts'
  },

  description: {
    type: String,
    required: true
  },

  senderAmount: {
    type: Number,
    require: true,
    default: 0
  },

  day: {
    type: Number
  },

  month: {
    type: Number
  },
  year: {
    type: Number
  },
  hour: {
    type: Number
  },

  minutes: {
    type: Number
  },

  createAt: {
    type: Date,
    default: Date.now
  }
});

const Transferences = model<TransferenceInterface>('transferences', TransferenceSchema);
export default Transferences;
