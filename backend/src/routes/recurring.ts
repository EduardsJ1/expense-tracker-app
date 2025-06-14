import express from 'express';
import {createRecurring, deleteRecurring, getRecurringTransactions} from '../controllers/recurring_transactions'
import { isAuthenticated } from '../middlewere';

const router = express.Router();

router.post('/recurring',isAuthenticated,createRecurring);
router.get('/recurring',isAuthenticated,getRecurringTransactions);
router.delete('/recurring/:id',isAuthenticated,deleteRecurring);

export default router;