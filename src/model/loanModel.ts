import { client } from "../db";
import { pool } from "../db";

export const createloanModel = (params: any) => {
  try {
    const { firstName, lastName, email, password, phone, address, status, isAdmin } = params;
    const newUser = [firstName, lastName, email, password, phone, address, status, isAdmin];
    const queryText =
      "INSERT INTO loans (firstname, lastname, email, password, phone, address, status, isAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    client.connect().then(() => {
      console.log("connected to postgres database");
      client.query(queryText, newUser, (err, result) => {
        if (err) {
          console.error("Error inserting data", err);
        } else {
          console.log("User created successfully");
        }

        client.end();
      });
    });
  } catch (error) {
    console.log(`error occured creating user ${error}`);
  }
};

export const getAllloanModel = async () => {
  try {
    // await pool.connect().then(() => console.log("database connected"));
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    // pool.end();
    return result.rows;
  } catch (error) {
    console.log(`error occured getting all user ${error}`);
  } finally {
    client.end().then(() => {
      console.log("Connection to PostgreSQL closed");
    });
  }
};
