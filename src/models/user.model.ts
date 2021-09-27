import { Schema, model } from 'mongoose';
import UserInterface from '../interfaces/user.interface';

export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    indexes: true,
    unique: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  genre: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },

  profession: {
    type: String
  },

  bio: {
    type: String
  },

  password: {
    type: String,
    require: true
  },

  avatar: {
    type: String
  },

  createAt: {
    type: Date,
    default: Date.now
  }
});

const User = model<UserInterface>('users', UserSchema);
export default User;
