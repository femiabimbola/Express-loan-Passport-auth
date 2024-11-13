
import { pool } from "../db";

export const createUserModel = async (params: any) => {
  const { firstName, lastName, email, password, phone, address, status, isAdmin } = params;

  const newUser = [firstName, lastName, email, password, phone, address, status, isAdmin];
  
  const queryText =
    "INSERT INTO users (firstname, lastname, email, password, phone, address, status, isAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";

  try {
    console.log(firstName)
    const result = await pool.query(queryText, newUser);
    return result.rows;
  } catch (error) {
    console.log(`error occured creating user ${error}`);
  } 
};

export const getAllUserModel = async () => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    return result.rows;
  } catch (error) {
    console.log(`error occured getting all user ${error}`);
  } 
};

export const findAUser = async(email : string) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows) {
      return rows[0];
    }
  } catch (error) {
    return false;
  }
}


export const findAphone = async(phone:number) =>{
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (rows) {
      return rows[0];
    }
  } catch (error) {
    return false;
  }
}

export const getAUserModel = async (id: number) => {
  const queryText = "SELECT * FROM loans WHERE id = $1";
  try {
    // await client.connect().then(() => console.log("connected to postgres database"));
    const result = await pool.query(queryText, [id]);
    // client.end().then(() => console.log("Connection to PostgreSQL closed"));
    return result.rows;
  } catch (error) {
    console.log(`error occured getting a user ${error}`);
  }
};
