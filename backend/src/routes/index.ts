import express from 'express';
import users from './users';
import transactions from './transactions';

const router = express.Router();


export default (): express.Router=>{
    router.use(users);
    router.use(transactions);
    return router;
}