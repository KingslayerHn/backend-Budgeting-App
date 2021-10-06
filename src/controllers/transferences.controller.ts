import requestWithUser from '../interfaces/request.with.user';
import { Response } from 'express';
import userModel from '../models/user.model';
import transferenceValidation from '../validations/transferenceValidation';
import transferencesModel from '../models/transferences.model';
import accountModel from '../models/accounts.model';
import { validate } from 'class-validator';
import moment from 'moment';

class Expenses {
  public async addTransference(req: requestWithUser, res: Response) {
    const { description, senderAmount } = req.body;
    const { idSenderAccount, idRecivedAccount } = req.params;

    try {
      // validate fields
      transferenceValidation.senderAmount = senderAmount;
      transferenceValidation.description = description;

      const errors = await validate(transferenceValidation);
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
      const senderAccount = await accountModel.findById(idSenderAccount);

      if (!senderAccount) {
        return res.status(400).json({
          status: 'error',
          message: 'Account does not exist!'
        });
      }
      //found if account exist
      const recivedAccount = await accountModel.findById(idRecivedAccount);

      if (!recivedAccount) {
        return res.status(400).json({
          status: 'error',
          message: 'Account does not exist!'
        });
      }
      // create transference
      const transference = new transferencesModel({
        user: userData._id,
        idSenderAccount: senderAccount._id,
        idRecivedAccount: recivedAccount._id,
        description,
        senderAmount,
        day: moment().date(),
        month: moment().month(),
        hour: moment().hour(),
        minutes: moment().minutes(),
        year: moment().year()
      });
      await transference.save();
      return res.status(200).send(transference);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }

  public async getAllTransferences(req: requestWithUser, res: Response) {
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
      const tranferences = await transferencesModel.find({
        user: user._id
      });

      return res.status(200).send(tranferences);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Server error!',
        error: error
      });
    }
  }
}

export default new Expenses();
