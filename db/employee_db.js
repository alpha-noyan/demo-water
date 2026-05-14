import db from "./db.js";

export async function createEmployee(
  name,
  father_name,
  cnic,
  phone_number,
  address,
  salary,
) {
  try {
    const result = await db.runAsync(
      `INSERT INTO employees (name,father_name,cnic,phone_number,address,salary) VALUES (?,?,?,?,?,?)`,
      [name, father_name, cnic, phone_number, address, salary],
    );
    console.log("Employee created with ID:", result.lastID);
  } catch (error) {
    console.error("Error creating employee:", error);
  }
}
