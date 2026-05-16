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
export async function getCampaign(country) {
    const query = `
        SELECT 
            c.campaignID, 
            c.title, 
            c.category, 
            c.description, 
            c.targetAmount, 
            c.deadline, 
            c.country,
            COALESCE(SUM(d.amount), 0) AS raisedAmount,
            COUNT(DISTINCT d.donatedBy) AS donorCount
        FROM Campaign c
        LEFT JOIN Donation d ON c.campaignID = d.campaignID
        WHERE (LOWER(c.country) = LOWER(?) OR ? = 'all') 
          AND c.status = 'Open'
        GROUP BY c.campaignID, c.title, c.category, c.description, c.targetAmount, c.deadline, c.country;
    `;
    try {
        const [rows] = await pool.query(query, [country, country]);
        return rows;
    } catch (sqlError) {
        // This will print the EXACT reason in your terminal
        console.error("CRITICAL SQL ERROR:", sqlError.message);
        throw sqlError; 
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
