import { Request } from 'express';
import UserInterface from './user.interface';

interface RequestWithUser extends Request {
    user: UserInterface;
}

export default RequestWithUser;
