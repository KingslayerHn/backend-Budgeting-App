import friendModel from '../models/friends.model';
import { Response } from 'express';
import RequestWithUser from '../interfaces/request.with.user';
import userModel from '../models/user.model';
class Friends {
  public async addFriendship(req: RequestWithUser, res: Response) {
    try {
      const { friend } = req.params;
      // check if user exist
      const user = await userModel.findOne({ _id: req.user._id });
      if (!user)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });

      // check if friend exist
      const friendExist = await userModel.findOne({
        _id: friend
      });

      if (!friendExist)
        return res.status(400).json({
          status: 'error',
          message: 'user to add frienship not exist!'
        });

      // add friendship
      const friendShip = new friendModel({
        user: user._id,
        friend
      });
      await friendShip.save();
      return res.status(200).send(friendShip);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }

  public async getAllFriendsByUser(req: RequestWithUser, res: Response) {
    try {
      // check if user exist
      const user = await userModel.findOne({ _id: req.user._id });
      if (!user)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });

      // get all friendship by user
      const friendship = await friendModel
        .find({
          user: req.user._id
        })
        .limit(6);
      return res.status(200).send(friendship);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }

  public async getAllUserFriendsById(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      // check if user logued  exist
      const user = await userModel.findOne({ _id: req.user._id });
      if (!user)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });

      // check if userFriend exist
      const userFriend = await userModel.findOne({ _id: id });
      if (!userFriend)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });

      // get all userFriends by id
      const friendShip = await friendModel
        .find({
          user: userFriend._id
        })
        .limit(3);

      return res.status(200).send(friendShip);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }

  public async changeStatusOfFriendship(req: RequestWithUser, res: Response) {
    const { friend } = req.params;
    const { status } = req.body;
    try {
      // check if user logued  exist
      const user = await userModel.findOne({ _id: req.user._id });
      if (!user)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });
      // check if friendship exist
      const friendExist = await userModel.findOne({
        _id: friend
      });

      if (!friendExist)
        return res.status(400).json({
          status: 'error',
          message: 'user that try to add friendship not exist!'
        });

      // check if friendship exist
      const friendshipExist = await friendModel.findOne({
        friend: friendExist._id,
        user: user._id
      });

      if (!friendshipExist)
        return res.status(400).json({
          status: 'error',
          message: 'user that try to add friendship not exist!'
        });

      // change status from friendship
      friendshipExist.status = status;
      friendshipExist.save();
      return res.status(200).send(friendshipExist);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }
}

export default new Friends();