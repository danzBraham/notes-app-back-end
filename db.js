import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const getAllEmployees = async () => {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM karyawan');
    console.log(result.rows);
  } catch (error) {
    console.error(error.message);
  } finally {
    await client.end();
  }
};

const insertEmployee = async (id, name, email, address) => {
  try {
    await client.connect();
    const result = await client.query({
      text: 'INSERT INTO karyawan VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, name, email, address],
    });
    console.log(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
};

await getAllEmployees();
// await insertEmployee(
//   'DCD003',
//   'Mas Sanji',
//   'sanji@gmail.com',
//   'Jl. Baratie No. 11 Jimbaran'
// );
