import db from './db';

export const init = async () => {
    try {

        await db.execAsync(`
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
        `);

        console.log('Database initialized');

    } catch (error) {
        console.log('Database init error:', error);
    }
};