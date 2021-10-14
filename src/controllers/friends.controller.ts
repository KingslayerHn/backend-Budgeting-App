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
        sender: user._id,
        reciver: friend
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
        .find({ $or: [{ sender: user._id }, { reciver: user._id }], status: 'accepted' })
        .populate('reciver')
        .populate('sender');

      return res.status(200).send(friendship);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: 'server error!'
      });
    }
  }

  public async getAllWaitingRequestFriendByUser(req: RequestWithUser, res: Response) {
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
          reciver: req.user._id,
          status: 'sent'
        })
        .populate('sender');

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
          user: userFriend._id,
          status: 'accepted'
        })
        .populate('friend')
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
      const friendshipExist = await friendModel
        .findOne({
          _id: friend
        })
        .populate('sender');

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
  public async checkFriendShip(req: RequestWithUser, res: Response) {
    const { friend } = req.params;

    try {
      // check if user logued  exist
      const user = await userModel.findOne({ _id: req.user._id });
      if (!user)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });

      // check if orher user exist
      const otherUser = await userModel.findOne({ _id: friend });
      if (!otherUser)
        return res.status(400).json({
          status: 'error',
          message: 'user not exist!'
        });

      //check frienship
      const frienshipAccepted = await friendModel.findOne({
        $or: [
          {
            $and: [{ reciver: user._id }, { sender: otherUser._id }, { status: 'accepted' }]
          },
          {
            $and: [{ sender: user._id }, { reciver: otherUser._id }, { status: 'accepted' }]
          }
        ]
      });

      if (frienshipAccepted) {
        return res.status(200).json({
          status: 'success',
          type: 'accepted'
        });
      }

      const friendShipSent = await friendModel.findOne({
        $or: [
          {
            $and: [{ reciver: user._id }, { sender: otherUser._id }, { status: 'sent' }]
          },
          {
            $and: [{ sender: user._id }, { reciver: otherUser._id }, { status: 'sent' }]
          }
        ]
      });

      if (friendShipSent) {
        return res.status(200).json({
          status: 'success',
          type: 'sent'
        });
      }
      return res.status(200).json({
        status: 'success',
        type: 'none'
      });
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
