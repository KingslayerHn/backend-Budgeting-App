import requestWithUser from '../interfaces/request.with.user';
import { Response } from 'express';
import userModel from '../models/user.model';
import expensesModel from '../models/expenses.model';
import incomesModel from '../models/income.model';
import transferencesModel from '../models/transferences.model';

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

  public async updateAccount(req: requestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { description } = req.body;
      let account = await accountModel.findOne({ _id: id });

      if (!account) return res.status(400).json({ status: 'error', message: 'dont exist the account!' });

      if (description) account.description = description;
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

  public async debit(req: requestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      // get all accounts of user
      const account = await accountModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            amount: amount
          }
        },
        { new: true }
      );
      return res.status(200).send(account);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }

  // stadistics
  public async getAllMonthStadistics(req: requestWithUser, res: Response) {
    try {
      // account id
      const { id } = req.params;

      // body
      const { month, year } = req.body;

      try {
        // valid if the user exist
        const user = await userModel.findOne({ _id: req.user._id });
        if (!user) return res.status(400).json({ status: 'error', message: 'user not exist!' });

        // valid if account exist
        const account = await accountModel.findOne({ _id: id });
        if (!account) return res.status(400).json({ status: 'error', message: 'account not exist!' });

        // get total expences
        const expenses = await expensesModel.aggregate([
          {
            $match: {
              user: req.user._id,
              account: account._id
            }
          },
          {
            $group: {
              _id: '',
              expenses: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);

        // get incomes
        const incomes = await incomesModel.aggregate([
          {
            $match: {
              user: req.user._id,
              account: account._id
            }
          },
          {
            $group: {
              _id: '',
              incomes: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);
        // get tranferences
        const transferencesIn = await transferencesModel.aggregate([
          {
            $match: {
              user: req.user._id,
              idRecivedAccount: account._id
            }
          },
          {
            $group: {
              _id: '',
              transferences: { $sum: '$senderAmount' },
              count: { $sum: 1 }
            }
          }
        ]);

        const transferencesOut = await transferencesModel.aggregate([
          {
            $match: {
              user: req.user._id,
              idSenderAccount: account._id
            }
          },
          {
            $group: {
              _id: '',
              transferences: { $sum: '$senderAmount' },
              count: { $sum: 1 }
            }
          }
        ]);

        return res.status(200).send({ expenses, incomes, transferencesIn, transferencesOut });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ status: 'error', message: 'Server error', error });
      }
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
