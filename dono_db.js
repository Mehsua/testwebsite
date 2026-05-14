import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

//Enivronment variables to automatically log you into your sql server
//.env file required, refer to README.txt
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


//Function to call all accounts for testing purposes
export async function getAccounts() {
    const [rows] = await pool.query("select * from dono_accounts");
    return rows;
}


//Function to insert new row through account creation page
export async function createAccount(username, password, country) {

    await pool.query(
        "insert into dono_accounts (username, password, country) values (?, ?, ?)",
        [username, password, country]
    )

    return {
        username,
        password,
        country
    }
}

// export async function getAccount(id)
// {
//     const [rows] = await pool.query
//     ("select * from accounts where id = ?", [id])
//     return rows[0]
// }

// export async function createAccount(name, id)
// {
//     const result = await pool.query
//     ("insert into accounts (name, id) values (?, ?)", [name, id])
//     return {name, id};
// }
