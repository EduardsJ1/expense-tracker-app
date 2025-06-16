import express from 'express';
import { isAuthenticated } from '../middlewere';
import {createTransaction, getTransactions, getTransaction, getTransactionsSummary, deleteTransaction, updateTransaction, getTransactionCategories, getFinancePrediction} from '../controllers/transactions';

const router = express.Router();

router.post('/transactions',isAuthenticated, createTransaction);
router.get('/transactions', isAuthenticated, getTransactions);
router.get('/transactions/summary', isAuthenticated, getTransactionsSummary);
router.get('/transactions/categories', isAuthenticated, getTransactionCategories);
router.get('/transactions/prediction',isAuthenticated,getFinancePrediction);


router.get('/transactions/:id', isAuthenticated, getTransaction);
router.delete('/transactions/:id', isAuthenticated, deleteTransaction);
router.patch('/transactions/:id', isAuthenticated, updateTransaction);


export default router;
