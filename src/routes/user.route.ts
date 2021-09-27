import userController from '../controllers/user.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router
  .post('/', userController.addUser)
  .get('/', auth, userController.getUser)
  .get('/by/:id', auth, userController.getUserById)
  .post('/signin', userController.Signin)
  .put('/update', auth, userController.updateUser)
  .post('/update/password', auth, userController.updatePassword);

export default router;
