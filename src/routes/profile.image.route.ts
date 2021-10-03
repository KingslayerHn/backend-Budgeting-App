import { Router } from 'express';
import profileImageController from '../controllers/profile.image.controller';
import { profileImageFile } from '../models/profile.image.model';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router
  .post('/upload', auth, profileImageFile.single('file'), profileImageController.uploadProfileImage)
  .get('/:fileName', profileImageController.getImageProfile)
  .delete('/:fileName', auth, profileImageController.deleteProfileImage);

export default router;
