/* eslint-disable func-names */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';
import RequestWithUser from '../interfaces/request.with.user';
import UserModel from '../models/user.model';
import DataStoredInToken from '../interfaces/data.storage.in.token';

export default async function (req: RequestWithUser, res: Response, next: NextFunction) {
  //get Token from header
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'El token no es valido' });
  }
  //verificar token
  try {
    const decoded = jwt.verify(token, keys.JWT) as DataStoredInToken;
    const data = await UserModel.findById(decoded.user._id);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'el token no e valido' });
  }
}
