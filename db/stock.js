import db from "./db";

export async function createRawItem(name, quantity) {
    try {
        await db.runAsync(
            `INSERT INTO raw_items (name, quantity) VALUES (?, ?)`,
            [name, quantity],
        );
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

export async function updateRawItem (id, name, quantity) {
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
        await db.runAsync(
            `DELETE FROM raw_items WHERE id = ?`,
            [id],
        );
        console.log("Raw item deleted with ID:", id);
    } catch (error) {
        console.error("Error deleting raw item:", error);
    }
}