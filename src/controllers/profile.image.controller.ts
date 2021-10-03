import Grid from 'gridfs-stream';
import { Response } from 'express';
import mongoose from 'mongoose';
import RequestWithUser from '../interfaces/request.with.user';
import keys from '../config/keys';
import userModel from '../models/user.model';

let gfs: Grid;

class ProfileImageController {
  constructor() {
    const conn = mongoose.createConnection(keys.MONGO_URL);
    conn.once('open', () => {
      gfs = Grid(conn.db, mongoose.mongo);
    });
  }

  public async uploadProfileImage(req: RequestWithUser, res: Response) {
    try {
      // get user
      const user = await userModel.findById(req.user._id);

      // if user exist
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'No existe el usuario'
        });
      }

      // add filename to user

      user.avatar = req.file.filename;
      await user.save();
      return res.status(200).send(req.file);
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'error al leer los datos' });
    }
  }

  public async getImageProfile(req: RequestWithUser, res: Response) {
    const { fileName } = req.params;

    gfs.collection('profileImageFile');
    const image = await gfs.files.findOne({ filename: fileName });

    if (!image) {
      return res.status(404).json(null);
    }

    if (image.contentType === 'image/jpeg' || image.contentType === 'image/png') {
      try {
        const readstream = gfs.createReadStream(image.filename);
        readstream.pipe(res);
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    } else {
      return res.status(401).json(null);
    }
  }

  public async deleteProfileImage(req: RequestWithUser, res: Response) {
    const { fileName } = req.params;

    gfs.collection('profileImageFile');
    const image = await gfs.files.findOne({ filename: fileName });

    if (!image) {
      return res.status(404).json({
        status: 'error',
        message: 'No existe la imagen que desea eliminar'
      });
    }

    // delete chunks and files
    await gfs.remove({ _id: image._id, root: 'profileImageFile' });

    return res.status(200).json({
      status: 'success',
      message: 'image deleted succefully'
    });
  }
}

export default new ProfileImageController();
