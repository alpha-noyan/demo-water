import db from "./db";

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

            -- Stock section

            CREATE TABLE IF NOT EXISTS raw_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS stock_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount INTEGER NOT NULL,
                reverse INTEGER NOT NULL DEFAULT 0,
                timeDate TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS stock_transactions_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id INTEGER NOT NULL,
                stock_item_id INTEGER NOT NULL,
                amount INTEGER NOT NULL,
                FOREIGN KEY (transaction_id) REFERENCES stock_transactions(id),
                FOREIGN KEY (stock_item_id) REFERENCES raw_items(id)
            );

            CREATE TRIGGER stock_insert_update
            AFTER INSERT ON stock_transactions_items
            BEGIN
                UPDATE raw_items
                SET quantity = quantity - NEW.amount
                WHERE id = NEW.stock_item_id;
            END;

            CREATE TRIGGER info_insert_update
            AFTER INSERT ON stock_transactions_items
            BEGIN
                UPDATE info
                SET current_amount = current_amount + (
                    SELECT CASE
                        WHEN reversed = 0 THEN -NEW.amount
                        ELSE NEW.amount
                    END
                    FROM stock_transactions
                    WHERE id = NEW.transaction_id
                )
                WHERE id = 1;
            END;

            CREATE TRIGGER stock_reverse_update
            AFTER UPDATE OF reversed ON stock_transactions
            WHEN NEW.reversed = 1 AND OLD.reversed = 0
            BEGIN
                UPDATE raw_items
                SET quantity = quantity + (
                    SELECT amount
                    FROM stock_transactions_items
                    WHERE transaction_id = NEW.id
                    AND stock_item_id = raw_items.id
                )
                WHERE EXISTS (
                    SELECT 1
                    FROM stock_transactions_items
                    WHERE transaction_id = NEW.id
                    AND stock_item_id = raw_items.id
                );
            END;

            CREATE TRIGGER info_reverse_update
            AFTER UPDATE OF reversed ON stock_transactions
            WHEN NEW.reversed = 1 AND OLD.reversed = 0
            BEGIN
                UPDATE info
                SET current_amount = current_amount + (
                    SELECT SUM(amount)
                    FROM stock_transactions_items
                    WHERE transaction_id = NEW.id
                )
                WHERE id = 1;
            END;

            
        `);

    console.log("Database initialized");
  } catch (error) {
    console.log("Database init error:", error);
  }
};
