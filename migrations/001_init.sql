-- 001_init.sql

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL UNIQUE,
    hash TEXT NOT NULL,
    init_cash NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    user_id INT REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL,
    UNIQUE (type, name)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category_id INT NOT NULL REFERENCES categories(id),
    amount NUMERIC(12,2) NOT NULL,
    comment TEXT,
    last_edit TIMESTAMP DEFAULT NOW()
);

-- Default categories, user_id NULL for global categories
INSERT INTO categories (name, type, user_id) VALUES
('Salary', 'income', NULL),
('Gift', 'income', NULL),
('Other in', 'income', NULL),
('Food', 'expense', NULL),
('Housing', 'expense', NULL),
('Utilities', 'expense', NULL),
('Transport', 'expense', NULL),
('Health', 'expense', NULL),
('Leisure', 'expense', NULL),
('Other out', 'expense', NULL);

-- Grant privileges to app user | userinfo in .env
GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO placeholder;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO placeholder;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO placeholder;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO placeholder;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO placeholder;