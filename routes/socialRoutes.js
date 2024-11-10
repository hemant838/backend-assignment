import { Router } from 'express';
import { followUser, unfollowUser, getFollowersFollowing } from '../controllers/socialController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = Router();

router.post('/follow/:userId', authMiddleware, followUser);

router.post('/unfollow/:userId', authMiddleware, unfollowUser);

router.get('/followers-following', authMiddleware, getFollowersFollowing);

export default router;
