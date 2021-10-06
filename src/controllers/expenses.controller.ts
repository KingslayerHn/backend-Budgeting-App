import requestWithUser from '../interfaces/request.with.user';
import { Response } from 'express';
import userModel from '../models/user.model';
import expensesValidation from '../validations/expensesValidation';
import expensesModel from '../models/expenses.model';
import accountModel from '../models/accounts.model';
import { validate } from 'class-validator';
import moment from 'moment';

class Expenses {
  public async addExpense(req: requestWithUser, res: Response) {
    const { description, amount } = req.body;
    const { id } = req.params;

    try {
      // validate fields
      expensesValidation.amount = amount;
      expensesValidation.description = description;

      const errors = await validate(expensesValidation);
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

      //found if account exist
      const accountData = await accountModel.findById(id);

      if (!accountData) {
        return res.status(400).json({
          status: 'error',
          message: 'Account does not exist!'
        });
      }
      // obtain date
      let date = moment();

      // create expense
      const expense = new expensesModel({
        user: userData._id,
        account: accountData._id,
        description,
        amount,
        day: moment().date(),
        month: moment().month(),
        hour: moment().hour(),
        minutes: moment().minutes(),
        year: moment().year()
      });
      await expense.save();

      return res.status(200).send(expense);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }

  public async getAllExpenses(req: requestWithUser, res: Response) {
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
      const expenses = await expensesModel.find({
        user: user._id
      });

      return res.status(200).send(expenses);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }
  // public async removeAccount(req: requestWithUser, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     // get all accounts of user
  //     const account = await accountModel.findOneAndRemove({ _id: id });
  //     return res.status(200).send(account);
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: 'error',
  //       message: 'Server error!',
  //       error: error
  //     });
  //   }
  // }
}

export default new Expenses();
