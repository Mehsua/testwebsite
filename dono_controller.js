import express from "express"
import path from "path"
import cors from "cors"
import {fileURLToPath} from "url"

//IMPORTANT!!!! Remember to add your function name here in order for them to work
import {getAccounts, createAccount} from "./dono_db.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

//Check dono_accounts table for matching rows, deny login if no match
app.post("/login", async (req, res) => {
    const {username, password} = req.body

    try {
        const accounts = await getAccounts()

        const user = accounts.find(
            acc => acc.username === username && acc.password === password
        )

        if (user) {
            res.json({success: true, message: "Login successful"})
        } else {
            res.json({success: false, message: "Invalid credentials"})
        }

    //Will only show if expressjs conenction not setup
    //remember to "node dono_controller" then "npm start"
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Server error"})
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

//For testing purposes
app.get("/dono_db", async (req,res) => {
    const accounts = await getAccounts()
    res.send(accounts)
})

//Runtime error handling from expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
console.error(err.stack)
res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})
