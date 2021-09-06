import userController from '../controllers/user.controller';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router.post('/', userController.addUser).get('/', auth, userController.getUser).get('/:id', auth, userController.getUserById).post('/signin', userController.Signin);

export default router;
