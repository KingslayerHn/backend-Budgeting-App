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

    password: {
        type: String
    },

    avatar: {
        type: String
    },

    role: {
        type: String,
        enum: ['admin', 'standard'],
        default: 'standard',
        require: true
    },

    createAt: {
        type: Date,
        default: Date.now
    }
});

const User = model<UserInterface>('users', UserSchema);
export default User;
