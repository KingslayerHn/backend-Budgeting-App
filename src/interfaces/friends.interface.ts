import { Schema, Document } from 'mongoose';
export default interface FriendsInterface extends Document {
  user: Schema.Types.ObjectId;
  friend: Schema.Types.ObjectId;
  status: Enumerator;
}
