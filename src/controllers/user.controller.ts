import { Request, Response } from 'express';
import userValidation from '../validations/user.validation';
import { validate } from 'class-validator';
import userModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import keys from '../config/keys';
import requestWithUser from '../interfaces/request.with.user';
import authValidation from '../validations/auth.validation';

class User {
  public async addUser(req: Request, res: Response) {
    const { firstName, lastName, email, password, genre } = req.body;

    userValidation.email = email;
    userValidation.firstName = firstName;
    userValidation.lastName = lastName;
    userValidation.genre = genre;
    userValidation.password = password;

    try {
      const errors = await validate(userValidation);
      if (errors.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'verifique los datos de registro'
        });
      }

      //revisar si el usuario existe
      let user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          status: 'error',
          message: 'Usuario ya se encuentra en uso'
        });
      }
      // agregar user
      user = new userModel({
        firstName,
        lastName,
        email,
        password,
        genre
      });

      //encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //generar y retornar token
      const payload = { user };
      jwt.sign(payload, keys.JWT, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token });
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error
      });
    }
  }

  public async getUser(req: requestWithUser, res: Response) {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'usuario no encontrado'
      });
    }
    return res.status(200).send(user);
  }

  public async getUserById(req: requestWithUser, res: Response) {
    const { id } = req.params;
    try {
      // revisar si existe el doctor
      const user = await userModel.findById(id).select('-password');
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'No se encontro el usuario'
        });
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Error en los datos '
      });
    }
  }

  public async Signin(req: Request, res: Response) {
    const { email, password } = req.body;

    //validar informacion que se recibe
    authValidation.email = email;
    authValidation.password = password;

    const errors = await validate(authValidation);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Verifique los datos de inicio de sesión'
      });
    }

    try {
      //verificar si el usuario existe
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'usuario o contraseña incorrecta'
        });
      }

      //verificar si la contraseña concuerda con los datos
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'Usuario o contraseña incorrecta'
        });
      }

      //generar y retornar token  token
      const payload = { user };
      jwt.sign(payload, keys.JWT, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          console.log('Error al fabricar el token');
          throw err;
        }
        return res.status(200).json({ token });
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new User();
