import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', wishlistController.getWishlist);
router.post('/:courseId', wishlistController.addToWishlist);
router.delete('/:courseId', wishlistController.removeFromWishlist);

export default router;
