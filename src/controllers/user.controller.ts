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
          message: 'Check all fields!!'
        });
      }

      //revisar si el usuario existe
      let user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already use!'
        });
      }
      // agregar user
      user = new userModel({
        firstName,
        lastName,
        email,
        password,
        genre,
        keywords: `${firstName} ${lastName}`
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
        message: 'Server error!',
        error: error
      });
    }
  }

  public async getUser(req: requestWithUser, res: Response) {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found!'
      });
    }
    return res.status(200).send(user);
  }

  public async getUserById(req: requestWithUser, res: Response) {
    const { id } = req.params;
    try {
      // check if user exist
      const user = await userModel.findById(id).select('-password');
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario not found!'
        });
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
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
        message: 'User or password incorrect!'
      });
    }

    try {
      //verificar si el usuario existe
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'User or password incorrect!'
        });
      }

      //verificar si la contraseña concuerda con los datos
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'User or password incorrect!'
        });
      }

      //generar y retornar token  token
      const payload = { user };
      jwt.sign(payload, keys.JWT, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        return res.status(200).json({ token });
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async updateUser(req: requestWithUser, res: Response) {
    const { firstName, lastName, email, bio, profession, genre } = req.body;
    const user = await userModel.findById(req.user.id);

    try {
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'User not found!'
        });
      }
      // update the properties
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (bio) user.bio = bio;
      if (profession) user.profession = profession;
      if (email) user.email = email;
      if (genre) user.genre = genre;
      user.keywords = `${firstName} ${lastName}`;

      await user.save();
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }

  public async updatePassword(req: requestWithUser, res: Response) {
    const user = await userModel.findById(req.user.id);
    const { password, newPass } = req.body;

    try {
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'User not found!'
        });
      }
      // found if the password match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'the password dont match with the actual password'
        });
      }

      // crypt new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPass, salt);
      await user.save();
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }

  public async getUsersSearchReferece(req: requestWithUser, res: Response) {
    const { text } = req.body;

    try {
      // check if user exist
      const user = await userModel.findOne({ _id: req.user._id });
      if (!user) return res.status(400).json({ status: 'error', message: 'user not exist!' });

      // search text
      const usersFound = await userModel
        .find({ keywords: { $regex: text, $options: 'i' } })
        .select('-password')
        .limit(10);
      return res.status(200).send(usersFound);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }
}

export default new User();
