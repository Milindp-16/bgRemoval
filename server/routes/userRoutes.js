// routes/userRouter.js

import express from 'express';
import { clerkWebhooks, userCredits } from '../controllers/UserController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);
userRouter.get('/credits', authUser, userCredits);

export default userRouter;
