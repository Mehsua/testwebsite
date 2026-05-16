import express from "express";
import path from "path";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";

import {
    getAccounts,
    createAccount,
    getCampaign,
    getDonations,
    createCampaign
} from "./dono_db.js";

console.log("DB USER:", process.env.MYSQL_USER);
console.log("DB PASS:", process.env.MYSQL_PASSWORD);
console.log("DB NAME:", process.env.MYSQL_DATABASE);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadDirectory = path.join(__dirname, "public", "uploads");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {
        const safeOriginalName = file.originalname.replace(/\s+/g, "-");
        const uniqueName = `${Date.now()}-${safeOriginalName}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }

        cb(null, true);
    }
});

app.use(cors({
    allowedHeaders: ["Content-Type", "x-user-country"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const accounts = await getAccounts();

        const user = accounts.find(
            acc => acc.username === username && acc.password === password
        );

        if (user) {
            res.json({
                success: true,
                role: user.role,
                country: user.country,
                username: user.username
            });
        } else {
            res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.post("/createAccount", async (req, res) => {
    const { username, password, rePassword, country } = req.body;

    try {
        const accounts = await getAccounts();

        const existingUser = accounts.find(
            acc => acc.username === username
        );

        if (existingUser) {
            return res.json({
                success: false,
                message: "Username already exists"
            });
        }

        if (password !== rePassword) {
            return res.json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (!country || country === "-no selection-") {
            return res.json({
                success: false,
                message: "Please select a country"
            });
        }

        await createAccount(username, password, country);

        res.json({
            success: true,
            message: "Account created successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.get("/api/donations", async (req, res) => {
    try {
        const donations = await getDonations();
        res.json(donations);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch donations"
        });
    }
});

app.get("/dono_db", async (req, res) => {
    try {
        const accounts = await getAccounts();
        res.send(accounts);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        });
    }
});

app.get("/getCampaign", async (req, res) => {
    const countryFilter = req.headers["x-user-country"] || "all";

    try {
        const campaign = await getCampaign(countryFilter);
        res.json(campaign);
    } catch (err) {
        console.error("Database error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch campaigns"
        });
    }
});

app.post(
    "/createCampaign",
    upload.fields([
        { name: "campaignImage", maxCount: 1 },
        { name: "campaignExtraImage", maxCount: 1 },
        { name: "campaignVideoThumbnail", maxCount: 1 }
    ]),
    async (req, res) => {
        const {
            title,
            country,
            category,
            description,
            targetAmount,
            deadline,
            createdBy
        } = req.body;

        const campaignImage = req.files?.campaignImage
            ? `/uploads/${req.files.campaignImage[0].filename}`
            : null;

        const campaignExtraImage = req.files?.campaignExtraImage
            ? `/uploads/${req.files.campaignExtraImage[0].filename}`
            : null;

        const campaignVideoThumbnail = req.files?.campaignVideoThumbnail
            ? `/uploads/${req.files.campaignVideoThumbnail[0].filename}`
            : null;

        try {
            if (!title || !country || !category || !description || !targetAmount || !deadline || !createdBy) {
                return res.json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const result = await createCampaign(
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
            );

            res.json({
                success: true,
                message: "Campaign created!",
                campaign: result
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message || "Something broke!"
    });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
