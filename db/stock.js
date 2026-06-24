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

export async function makeStockItemTransaction(
  name,
  quantity,
  rawItems
) {
  try {
    if (!name?.trim()) {
      throw new Error("Name is required");
    }

    if (!quantity || Number(quantity) <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new Error("Raw items are required");
    }

    return await db.withTransactionAsync(async () => {
      const transactionResult = await db.runAsync(
        `
        INSERT INTO ready_stock_item
        (name, quantity)
        VALUES (?, ?)
        `,
        [name.trim(), Number(quantity)]
      );

      const readyStockId =
        transactionResult.lastInsertRowId;

      for (const item of rawItems) {
        const rawItemId = Number(item.raw_item_id);
        const rawQuantity = Number(item.quantity);

        if (rawItemId <= 0 || rawQuantity <= 0) {
          throw new Error("Invalid raw item");
        }

        await db.runAsync(
          `
          INSERT INTO ready_stock_raw_items
          (
            ready_stock_item_id,
            raw_item_id,
            quantity
          )
          VALUES (?, ?, ?)
          `,
          [readyStockId, rawItemId, rawQuantity]
        );
      }

      return {
        success: true,
        readyStockId,
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchStockItemById(id) {
  try {
    const stockItem = await db.getFirstAsync(
      `
      SELECT *
      FROM ready_stock_item
      WHERE id = ?
      `,
      [id]
    );

    if (!stockItem) {
      return null;
    }

    const rawItems = await db.getAllAsync(
      `
      SELECT
        rsri.id,
        rsri.raw_item_id,
        rsri.quantity,
        r.name AS raw_item_name
      FROM ready_stock_raw_items rsri
      JOIN raw_items r
        ON r.id = rsri.raw_item_id
      WHERE rsri.ready_stock_item_id = ?
      `,
      [id]
    );

    return {
      ...stockItem,
      rawItems,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function reverseStockItemTransaction(id) {
  try {
    const result = await db.runAsync(
      `
      UPDATE ready_stock_item
      SET reverse = 1
      WHERE id = ?
      AND reverse = 0
      `,
      [id]
    );

    return result.changes > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteStockItemTransaction(id) {
  try {
    return await db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        DELETE FROM ready_stock_raw_items
        WHERE ready_stock_item_id = ?
        `,
        [id]
      );

      await db.runAsync(
        `
        DELETE FROM ready_stock_item
        WHERE id = ?
        `,
        [id]
      );

      return true;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}