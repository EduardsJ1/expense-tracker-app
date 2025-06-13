import {Pool} from 'pg';

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'expense_db',
    password: 'password123',
    port: 5432,
});


export default db