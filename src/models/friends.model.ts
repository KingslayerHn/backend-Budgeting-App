import { Schema, model } from 'mongoose';
import FriendsInterface from '../interfaces/friends.interface';

export const FriendSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  reciver: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },

  status: {
    type: String,
    required: true,
    enum: ['accepted', 'decline', 'sent'],
    default: 'sent'
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const Friends = model<FriendsInterface>('friends', FriendSchema);
export default Friends;
