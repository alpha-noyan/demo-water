import db from "./db";

export const fetchInfo = async () => {
  try {
    const result = await db.getAllAsync(`
            SELECT * FROM info WHERE id = 1;
        `);
    console.log(result);
    return result[0];
  } catch (error) {
    console.error("Error fetching info:", error);
    throw error;
  }
};

export const updateInfo = async (name) => {
  try {
    await db.runAsync(
      `
            UPDATE info SET name = ? WHERE id = 1;
        `,
      [name],
    );
    console.log("Info updated successfully");
  } catch (error) {
    console.error("Error updating info:", error);
    throw error;
  }
};

export const makeTransaction = async (amount, name) => {
  try {
    const date = new Date().toISOString();
    await db.runAsync(
      `
            INSERT INTO info_transactions (name, amount, date) VALUES (?, ?, ?)
            `,
      [name, amount, date],
    );
    console.log("Transaction added successfully");
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const fetchTransaction = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const result = await db.getAllAsync(`
            SELECT * FROM info_transactions
            ORDER BY date DESC
            LIMIT ${limit} OFFSET ${offset};
        `);

    const count = await db.getFirstAsync(
      `SELECT COUNT(*) as total FROM info_transactions`,
    );

    const totalPages = Math.ceil(count.total / limit);

    return { result, totalPages };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const reverseTransactionn = async (id) => {
    try{
        await db.runAsync(
            `
                UPDATE info_transactions
                SET status = 'reversed', type = 'debit'
                WHERE id = ?
            `,
            [id]
        );
        console.log("Transaction reversed successfully");
    } catch (error) {
        console.error("Error reversing transaction:", error);
        throw error;
    }
}