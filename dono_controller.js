import express from "express"
import path from "path"
import cors from "cors"
import {fileURLToPath} from "url"

//IMPORTANT!!!! Remember to add your function name here in order for them to work
import {getAccounts, createAccount, getCampaigns, getDonations} from "./dono_db.js"

console.log("DB USER:", process.env.MYSQL_USER)
console.log("DB PASS:", process.env.MYSQL_PASSWORD)
console.log("DB NAME:", process.env.MYSQL_DATABASE)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(cors({
    allowedHeaders: ['Content-Type', 'x-user-country']}))
app.use(express.json())
app.use(express.static("public"))

//Check dono_accounts table for matching rows, deny login if no match
//Check for role, send to admin_dashboard.html if role = admin
//Else, send to index.html
app.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const accounts = await getAccounts()

        const user = accounts.find(
            acc => acc.username === username && acc.password === password
        )

        if (user) {
            res.json({
                success: true,
                role: user.role
            })
        } 
        
        else {
            res.json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (err) {
        console.error(err)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
})

app.post("/createAccount", async (req, res) => {

    //// Test if button is calling
    // console.log("CREATE ACCOUNT HIT:", req.body)
    const {username, password, rePassword, country} = req.body

    try {

        const accounts = await getAccounts()

        const existingUser = accounts.find(
            acc => acc.username === username
        )

        if (existingUser) {
            return res.json({
                success: false,
                message: "Username already exists"
            })
        }

        if (password !== rePassword) {
            return res.json({
                success: false,
                message: "Passwords do not match"
            })
        }

        if (!country || country === "-no selection-") {
            return res.json({
                success: false,
                message: "Please select a country"
            })
        }

        await createAccount(username, password, country)

        res.json({
            success: true,
            message: "Account created successfully"
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
})

app.get("/api/donations", async (req, res) => {
    const donations = await getDonations()
    res.json(donations)
})

//For testing purposes
app.get("/dono_db", async (req,res) => {
    const accounts = await getAccounts()
    res.send(accounts)
})
app.get("/getCampaigns", async (req, res) => {
    const countryFilter = req.headers['x-user-country'] || 'all';

    try {
        // We pass the country header directly to our database function
        const campaigns = await getCampaigns(countryFilter);
        
        res.json(campaigns);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch campaigns" });
    }
});

//Runtime error handling from expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
console.error(err.stack)
res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})


