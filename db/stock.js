import db from "./db";

export async function createRawItem(name, quantity) {
  try {
    await db.runAsync(`INSERT INTO raw_items (name, quantity) VALUES (?, ?)`, [
      name,
      quantity,
    ]);
    console.log("Raw item created");
  } catch (error) {
    console.error("Error creating raw item:", error);
  }
}

export async function fetchRawItems() {
  try {
    const rawItems = await db.getAllAsync("SELECT * FROM raw_items");
    return rawItems;
  } catch (error) {
    console.error("Error fetching raw items:", error);
    return [];
  }
}

export async function updateRawItem(id, name, quantity) {
  try {
    await db.runAsync(
      `UPDATE raw_items SET name = ?, quantity = ? WHERE id = ?`,
      [name, quantity, id],
    );
    console.log("Raw item updated with ID:", id);
  } catch (error) {
    console.error("Error updating raw item:", error);
  }
}

export async function deleteRawItem(id) {
  try {
    await db.runAsync(`DELETE FROM raw_items WHERE id = ?`, [id]);
    console.log("Raw item deleted with ID:", id);
  } catch (error) {
    console.error("Error deleting raw item:", error);
  }
}

// CORRECTED: makeInboundTransaction using withTransactionAsync
export async function makeInboundTransaction(items, amount) {
    console.log("makeInboundTransaction called with items:", items, "and amount:", amount);
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items array is required");
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid amount");
    }

    return await db.withTransactionAsync(async () => {
      // Create stock transaction
      const transactionResult = await db.runAsync(
        `
        INSERT INTO stock_transactions
        (amount, reverse, timeDate)
        VALUES (?, ?, ?)
        `,
        [numericAmount, 0, new Date().toISOString()]
      );

      const transactionId = transactionResult.lastInsertRowId;

      if (!transactionId) {
        throw new Error("Failed to create transaction");
      }

      // Insert all selected items
      for (const item of items) {
        const itemId = Number(item.id);
        const itemAmount = Number(item.quantity);

        if (isNaN(itemId) || itemId <= 0) {
          throw new Error(`Invalid item id: ${item.id}`);
        }

        if (isNaN(itemAmount) || itemAmount <= 0) {
          throw new Error(
            `Invalid quantity for item: ${item.name}`
          );
        }

        await db.runAsync(
          `
          INSERT INTO stock_transactions_items
          (transaction_id, stock_item_id, amount)
          VALUES (?, ?, ?)
          `,
          [transactionId, itemId, itemAmount]
        );
      }

      return {
        success: true,
        transactionId,
      };
    });
  } catch (error) {
    console.error(
      "Error creating inbound transaction:",
      error
    );
    throw error;
  }
}

// CORRECTED: reverseInboundTransaction
export async function reverseInboundTransaction(transactionId) {
  try {
    if (!transactionId || isNaN(transactionId)) {
      throw new Error("Valid transaction ID is required");
    }

    // First check if transaction exists and is not already reversed
    const transaction = await db.getFirstAsync(
      `SELECT * FROM stock_transactions WHERE id = ? AND reversed = 0`,
      [transactionId]
    );

    if (!transaction) {
      throw new Error("Transaction not found or already reversed");
    }

    const result = await db.runAsync(
      `UPDATE stock_transactions SET reversed = 1 WHERE id = ? AND reversed = 0`,
      [transactionId]
    );

    if (result.changes === 0) {
      throw new Error("Transaction not found or already reversed");
    }

    console.log(`Transaction ${transactionId} reversed successfully`);
    return { success: true, transactionId };
  } catch (error) {
    console.error("Error reversing transaction:", error);
    throw error;
  }
}

// CORRECTED: getStockTransactions
export async function getStockTransactions() {
  try {
    const transactions = await db.getAllAsync(
      `SELECT 
        st.id,
        st.amount,
        st.reversed,
        st.timeDate,
        GROUP_CONCAT(
          json_object(
            'item_id', sti.stock_item_id,
            'item_name', ri.name,
            'quantity', sti.amount
          )
        ) as items
      FROM stock_transactions st
      LEFT JOIN stock_transactions_items sti ON st.id = sti.transaction_id
      LEFT JOIN raw_items ri ON sti.stock_item_id = ri.id
      GROUP BY st.id
      ORDER BY st.timeDate DESC`
    );
    
    // Parse the items JSON for each transaction
    return transactions.map(transaction => {
      if (transaction.items) {
        try {
          // The items come as a JSON string, we need to parse it
          // But since GROUP_CONCAT with json_object might not work in all SQLite versions,
          // we'll handle it carefully
          const itemsString = transaction.items;
          // If it's a string that looks like JSON array, parse it
          if (itemsString && itemsString.startsWith('[')) {
            transaction.items = JSON.parse(itemsString);
          } else if (itemsString) {
            // If it's a single object, wrap it in array
            try {
              const parsed = JSON.parse(itemsString);
              transaction.items = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              transaction.items = [];
            }
          } else {
            transaction.items = [];
          }
        } catch (error) {
          console.warn("Error parsing items JSON:", error);
          transaction.items = [];
        }
      } else {
        transaction.items = [];
      }
      return transaction;
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}