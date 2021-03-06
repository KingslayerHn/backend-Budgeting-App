import { Router } from 'express';
import friendsController from '../controllers/friends.controller';
import auth from '../middlewares/auth.middleware';

const router: Router = Router();

router
  .post('/:friend', auth, friendsController.addFriendship)
  .get('/', auth, friendsController.getAllFriendsByUser)
  .get('/waiting', auth, friendsController.getAllWaitingRequestFriendByUser)
  .get('/by/id/:id', auth, friendsController.getAllUserFriendsById)
  .put('/:friend/', auth, friendsController.changeStatusOfFriendship)
  .post('/are/friends/:friend', auth, friendsController.checkFriendShip);

export default router;
