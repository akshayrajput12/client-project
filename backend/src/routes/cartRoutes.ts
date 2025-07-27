import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  getCartSummary 
} from '../controllers/cartController';
import { requireAuth } from '../controllers/authController';

const router = express.Router();

// All cart routes require authentication
router.use(requireAuth);

// Cart routes
router.get('/', getCart);
router.get('/summary', getCartSummary);
router.post('/add', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;
