import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { addToCart, clearCart, deleteCartItem, getCart } from '../controllers/cartController.js';

const cartRouter = express.Router();
cartRouter.use(authMiddleware);
cartRouter.get('/', getCart);
cartRouter.post('/', addToCart);
cartRouter.put('/:id', deleteCartItem);
cartRouter.post('/clear', clearCart);

export default cartRouter;