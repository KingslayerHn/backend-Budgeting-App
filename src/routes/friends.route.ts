import { Router } from 'express';
import friendsController from '../controllers/friends.controller';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router
  .post('/:friend', auth, friendsController.addFriendship)
  .get('/', auth, friendsController.getAllFriendsByUser)
  .get('/by/id/:id', auth, friendsController.getAllUserFriendsById)
  .put('/:friend/', auth, friendsController.changeStatusOfFriendship);

export default router;
