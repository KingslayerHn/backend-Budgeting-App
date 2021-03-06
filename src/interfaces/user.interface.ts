/* eslint-disable semi */
import { Document } from 'mongoose';
export default interface UserInterface extends Document {
  email: string;
  firstName: string;
  lastName: string;
  genre: string;
  profession: string;
  bio: string;
  password: string;
  avatar: string;
  keywords: string;
  createAt: Date;
}
