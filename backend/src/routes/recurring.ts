import express from 'express';
import {createRecurring, deleteRecurring, getRecurringTransactions, updateRecurring} from '../controllers/recurring_transactions'
import { isAuthenticated } from '../middlewere';
const router = express.Router();

router.post('/recurring',isAuthenticated,createRecurring);
router.get('/recurring',isAuthenticated,getRecurringTransactions);
router.delete('/recurring/:id',isAuthenticated,deleteRecurring);
router.patch('/recurring/:id',isAuthenticated,updateRecurring);

export default router;