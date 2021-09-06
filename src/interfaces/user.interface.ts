/* eslint-disable semi */
import { Document } from 'mongoose';
export default interface UserInterface extends Document {
    email: string;
    firstName: string;
    lastName: string;
    genre: string;
    password: string;
    avatar: string;
    role: string;
    createAt: Date;
}
