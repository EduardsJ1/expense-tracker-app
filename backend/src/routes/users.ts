import express from 'express';
import { getUsers, login, register, getUserInfo, logout, updateUser } from '../controllers/users';
import { isAuthenticated } from '../middlewere';
const router = express.Router();


router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout)
router.patch(`/auth/user`,isAuthenticated,updateUser);
router.get('/users',getUsers);
router.get('/users/me', isAuthenticated,getUserInfo);

export default router;