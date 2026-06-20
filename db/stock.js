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