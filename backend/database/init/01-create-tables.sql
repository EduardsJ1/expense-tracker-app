-- Create users table

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create recurring transactions table
CREATE TABLE IF NOT EXISTS recurring (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    note TEXT,
    recurrence_type TEXT NOT NULL,
    start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    next_occurrence TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    custom_unit TEXT,
    custom_interval INTEGER,
    CONSTRAINT recurring_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    recurring_id INTEGER,
    CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT transactions_recurring_id_fkey FOREIGN KEY (recurring_id) REFERENCES recurring(id) ON DELETE SET NULL
);