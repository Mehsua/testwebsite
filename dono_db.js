import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

//This is the SQL connector, create all your functions that call dono_DB here
//Enivronment variables, my sql server is not the same your sql server
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getAccounts() {
    const [rows] = await pool.query("SELECT * FROM accounts");
    return rows;
}

export async function getAccount(id)
{
    const [rows] = await pool.query
    ("select * from accounts where id = ?", [id])
    return rows[0]
}

export async function createAccount(name, id)
{
    const result = await pool.query
    ("insert into accounts (name, id) values (?, ?)", [name, id])
    return {name, id};
}
