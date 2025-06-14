import express from 'express';
import { getUsers, login, register, getUserInfo, logout } from '../controllers/users';
import { isAuthenticated } from '../middlewere';
const router = express.Router();


router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout)
router.get('/users',getUsers);
router.get('/users/me', isAuthenticated,getUserInfo);

export default router;