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
export async function getCampaigns(country) {
    // We use a base query. 
    // Even if you didn't make the table, we assume these standard columns exist
    let query = "SELECT * FROM campaigns";
    let params = [];

    // If the frontend sends a country (via the header), we filter the results
    if (country && country !== "all" && country !== "null" && country !== "-no selection-") {
        query += " WHERE country = ?";
        params.push(country);
    }

    try {
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (err) {
        // If the table doesn't exist yet because your teammate hasn't made it,
        // this catch prevents the whole server from crashing.
        console.error("Database Error: Is the 'campaigns' table created yet?", err.message);
        return []; 
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
export async function getDonations() {
    const [rows] = await pool.query(`
            SELECT 
                d.donationID,
                c.title,
                c.status,
                c.deadline,
                d.amount
            FROM Donation d
            JOIN Campaign c ON d.campaignID = c.campaignID
        `)

    return rows
}
