import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getAccounts() {
    const [rows] = await pool.query("SELECT * FROM dono_accounts");
    return rows;
}

export async function createAccount(username, password, country) {
    await pool.query(
        "INSERT INTO dono_accounts (username, password, country) VALUES (?, ?, ?)",
        [username, password, country]
    );

    return {
        username,
        password,
        country
    };
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
            c.createdBy,
            c.campaignImage,
            c.campaignExtraImage,
            c.campaignVideoThumbnail,
            COALESCE(SUM(d.amount), 0) AS raisedAmount,
            COUNT(DISTINCT d.donatedBy) AS donorCount
        FROM Campaign c
        LEFT JOIN Donation d 
            ON c.campaignID = d.campaignID
        WHERE (LOWER(c.country) = LOWER(?) OR ? = 'all')
          AND c.status = 'Open'
        GROUP BY 
            c.campaignID,
            c.title,
            c.category,
            c.description,
            c.targetAmount,
            c.deadline,
            c.country,
            c.createdBy,
            c.campaignImage,
            c.campaignExtraImage,
            c.campaignVideoThumbnail
    `;

    try {
        const [rows] = await pool.query(query, [country, country]);
        return rows;
    } catch (sqlError) {
        console.error("CRITICAL SQL ERROR:", sqlError.message);
        throw sqlError;
    }
}

export async function getDonations() {
    const [rows] = await pool.query(`
        SELECT 
            d.donationID,
            c.title,
            c.status,
            c.deadline,
            d.amount
        FROM Donation d
        JOIN Campaign c 
            ON d.campaignID = c.campaignID
    `);

    return rows;
}

async function generateNextCampaignId() {
    const [rows] = await pool.query(`
        SELECT campaignID
        FROM Campaign
        ORDER BY CAST(SUBSTRING(campaignID, 2) AS UNSIGNED) DESC
        LIMIT 1
    `);

    if (rows.length === 0) {
        return "C001";
    }

    const lastIdNumber = Number(String(rows[0].campaignID).replace("C", ""));
    const nextIdNumber = lastIdNumber + 1;

    return "C" + String(nextIdNumber).padStart(3, "0");
}

async function generateNextUserId() {
    const [rows] = await pool.query(`
        SELECT userID
        FROM SystemUser
        ORDER BY CAST(SUBSTRING(userID, 2) AS UNSIGNED) DESC
        LIMIT 1
    `);

    if (rows.length === 0) {
        return "U001";
    }

    const lastIdNumber = Number(String(rows[0].userID).replace("U", ""));
    const nextIdNumber = lastIdNumber + 1;

    return "U" + String(nextIdNumber).padStart(3, "0");
}

async function getOrCreateFundraiserId(createdByName) {
    const safeName = String(createdByName).trim() || "Campaign Creator";

    const [existingRows] = await pool.query(
        `
        SELECT su.userID
        FROM SystemUser su
        JOIN Fundraiser f
            ON su.userID = f.fundraiserID
        WHERE LOWER(su.name) = LOWER(?)
        LIMIT 1
        `,
        [safeName]
    );

    if (existingRows.length > 0) {
        return existingRows[0].userID;
    }

    const newUserId = await generateNextUserId();
    const safeEmailName = safeName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const generatedEmail = `${newUserId}@dono.local`;

    await pool.query(
        `
        INSERT INTO SystemUser
            (userID, name, email, password)
        VALUES
            (?, ?, ?, ?)
        `,
        [
            newUserId,
            safeName,
            generatedEmail,
            "default123"
        ]
    );

    await pool.query(
        `
        INSERT INTO Fundraiser
            (fundraiserID)
        VALUES
            (?)
        `,
        [newUserId]
    );

    return newUserId;
}

export async function createCampaign(
    title,
    country,
    category,
    description,
    targetAmount,
    deadline,
    createdBy,
    campaignImage,
    campaignExtraImage,
    campaignVideoThumbnail
) {
    const campaignID = await generateNextCampaignId();

    const fundraiserID = await getOrCreateFundraiserId(createdBy);

    await pool.query(
        `
        INSERT INTO Campaign
            (
                campaignID,
                title,
                country,
                category,
                description,
                targetAmount,
                deadline,
                status,
                createdBy,
                campaignImage,
                campaignExtraImage,
                campaignVideoThumbnail
            )
        VALUES
            (?, ?, ?, ?, ?, ?, ?, 'Open', ?, ?, ?, ?)
        `,
        [
            campaignID,
            title,
            country,
            category,
            description,
            targetAmount,
            deadline,
            fundraiserID,
            campaignImage,
            campaignExtraImage,
            campaignVideoThumbnail
        ]
    );

    return {
        campaignID,
        title,
        country,
        category,
        description,
        targetAmount,
        deadline,
        createdBy: fundraiserID,
        campaignImage,
        campaignExtraImage,
        campaignVideoThumbnail
    };
}
