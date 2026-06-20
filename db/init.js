import db from './db';

export const init = async () => {
    try {

        await db.execAsync(`

            -- basic info section

            CREATE TABLE IF NOT EXISTS info (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                amount INTEGER NOT NULL,
                current_amount INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS info_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                amount INTEGER NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'invested',
                type TEXT NOT NULL DEFAULT 'credit'
            );

            CREATE TRIGGER IF NOT EXISTS add_transaction_amount
            AFTER INSERT ON info_transactions
            BEGIN
                UPDATE info
                SET 
                    amount = amount + 
                        CASE
                            WHEN NEW.type = 'credit' THEN NEW.amount
                            WHEN NEW.type = 'debit' THEN -NEW.amount
                            ELSE 0
                        END,
                    current_amount = current_amount +
                        CASE
                            WHEN NEW.type = 'credit' THEN NEW.amount
                            WHEN NEW.type = 'debit' THEN -NEW.amount
                            ELSE 0
                        END
                WHERE id = 1;
            END;

            CREATE TRIGGER IF NOT EXISTS reverse_transaction_amount
            AFTER UPDATE OF status ON info_transactions
            WHEN NEW.status = 'reversed' AND OLD.status != 'reversed'
            BEGIN
                UPDATE info
                SET
                    amount = amount +
                        CASE
                            WHEN NEW.type = 'credit' THEN NEW.amount
                            WHEN NEW.type = 'debit' THEN -NEW.amount
                            ELSE 0
                        END,
                    current_amount = current_amount +
                        CASE
                            WHEN NEW.type = 'credit' THEN NEW.amount
                            WHEN NEW.type = 'debit' THEN -NEW.amount
                            ELSE 0
                        END
                WHERE id = 1;
            END;

            INSERT OR IGNORE INTO info (id, name, amount, current_amount) VALUES (1, 'Khattak Traders', 0, 0);

            -- Employee section

            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                father_name TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                address TEXT NOT NULL,
                cnic TEXT NOT NULL,
                salary INTEGER NOT NULL,
                date_of_joining TEXT NOT NULL,
                left INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS employee_salaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                amount INTEGER NOT NULL,
                date TEXT NOT NULL,
                reversed INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (employee_id) REFERENCES employees (id)
            );

            CREATE TABLE IF NOT EXISTS raw_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL
            );

            CREATE TRIGGER IF NOT EXISTS add_salary_amount
            AFTER INSERT ON employee_salaries
            BEGIN
                UPDATE info
                SET
                    current_amount = current_amount - NEW.amount
                    WHERE id = 1;
            END;

            CREATE TRIGGER IF NOT EXISTS reverse_salary_amount
            AFTER UPDATE OF reversed ON employee_salaries
            WHEN NEW.reversed = 1 AND OLD.reversed = 0
            BEGIN
                UPDATE info
                SET
                    current_amount = current_amount + NEW.amount
                WHERE id = 1;
            END;

            

        `);

        console.log('Database initialized');

    } catch (error) {
        console.log('Database init error:', error);
    }
};