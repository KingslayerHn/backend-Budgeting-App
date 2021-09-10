import requestWithUser from '../interfaces/request.with.user';
import { Response } from 'express';
import userModel from '../models/user.model';
import accountValidation from '../validations/account.validation';
import accountModel from '../models/accounts.model';
import { validate } from 'class-validator';

class Account {
  public async addAccount(req: requestWithUser, res: Response) {
    const { description, amount } = req.body;

    try {
      // validate fields
      accountValidation.amount = amount;
      accountValidation.description = description;

      const errors = await validate(accountValidation);
      if (errors.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Check all fields!!'
        });
      }

      // found if user exist
      const userData = await userModel.findById(req.user._id);
      if (!userData) {
        return res.status(400).json({
          status: 'error',
          message: 'User not found or not exist!'
        });
      }

      // create amount
      const account = new accountModel({
        user: userData._id,
        description,
        amount
      });
      await account.save();

      return res.status(200).send(account);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }

  public async getAllUserAccounts(req: requestWithUser, res: Response) {
    try {
      // found if user exist
      const user = await userModel.findById(req.user._id);
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'User not found or not exist!'
        });
      }
      // get all accounts of user
      const accounts = await accountModel.find({
        user: user._id
      });

      return res.status(200).send(accounts);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }
  public async removeAccount(req: requestWithUser, res: Response) {
    try {
      const { id } = req.params;
      // get all accounts of user
      const account = await accountModel.findOneAndRemove({ _id: id });
      return res.status(200).send(account);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }
}

export default new Account();
