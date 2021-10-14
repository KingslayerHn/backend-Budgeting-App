import { Schema, Document } from 'mongoose';
export default interface FriendsInterface extends Document {
  sender: Schema.Types.ObjectId;
  reciver: Schema.Types.ObjectId;
  status: String;
  createAt: Date;
}
