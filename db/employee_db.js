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
      [name, father_name, cnic, phone_number, address, salary, new Date().toISOString()],
    );
    console.log("Employee created with ID:", phone_number);
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

export async function makeTransaction (employee_id, amount) {
  try{
    await db.runAsync(`
      INSERT INTO employee_salaries (employee_id, amount, date) VALUES (?, ?, ?)
    `, [employee_id, amount, new Date().toISOString()]);
    console.log("Transaction recorded for employee ID:", employee_id, "Amount:", amount);
  } catch (error) {
    console.error("Error making transaction:", error);
  }
}

export async function fetchEmployeeSalaries (employee_id, page = 1) {
  try{
    const totalPages = await db.getFirstAsync(`SELECT  COUNT(*) as total FROM employee_salaries WHERE employee_id = ?`, [employee_id]);
    const limit = 10;
    const offset = (page - 1) * limit;
    const salaries = await db.getAllAsync(`
      SELECT * FROM employee_salaries WHERE employee_id = ? ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}
    `, [employee_id]);
    return { salaries, totalPages: totalPages.total };
  } catch (error) {
    console.error("Error fetching employee salaries:", error);
    return { salaries: [], totalPages: 0 };
  }
}