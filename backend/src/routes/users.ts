import express from 'express';
import { getUsers, login, register, getUserInfo } from '../controllers/users';
import { isAuthenticated } from '../middlewere';
const router = express.Router();


router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/users',getUsers);
router.get('/users/me', isAuthenticated,getUserInfo);

export default router;