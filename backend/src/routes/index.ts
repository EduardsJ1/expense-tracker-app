import express from 'express';
import users from './users';
import transactions from './transactions';
import recurring from './recurring';

const router = express.Router();


export default (): express.Router=>{
    router.use(users);
    router.use(transactions);
    router.use(recurring);
    return router;
}