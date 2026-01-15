// src/routes/user.routes.js
import { Router } from 'express';
import { registerUser, loginUser, getUsers, getUserById } from '../controllers/user.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
