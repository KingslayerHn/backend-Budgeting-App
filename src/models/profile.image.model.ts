import path from 'path';
import multer from 'multer';

import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import keys from '../config/keys';

const storageProfileImage = new GridFsStorage({
  url: keys.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'profileImageFile'
        };
        resolve(fileInfo);
      });
    });
  }
});

const profileImageFile = multer({
  storage: storageProfileImage
});

export { profileImageFile, storageProfileImage };
