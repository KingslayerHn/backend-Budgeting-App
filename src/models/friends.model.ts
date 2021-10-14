import { Schema, model } from 'mongoose';
import FriendsInterface from '../interfaces/friends.interface';

export const FriendSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'decline', 'sent'],
    default: 'sent'
  }
});

const Friends = model<FriendsInterface>('friends', FriendSchema);
export default Friends;
