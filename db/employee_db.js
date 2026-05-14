import db from "./db.js";

export async function createEmployee(
  name,
  father_name,
  address,
  cnic,
  salary,
  phone_number
) {
  try {
    const result = await db.runAsync(
      `INSERT INTO employees (name,father_name,cnic,phone_number,address,salary,date_of_joining) VALUES (?,?,?,?,?,?,?)`,
      [name, father_name, cnic, String(phone_number), address, salary, new Date().toISOString()],
    );
    console.log("Employee created with ID:", result?.lastID);
  } catch (error) {
    console.error("Error creating employee:", error);
  }
}

export async function fetchEmployees() {
  try {
    const employees = await db.getAllAsync("SELECT * FROM employees");
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}