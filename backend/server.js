require("dotenv").config();

const pool = require("./src/config/database");
const initDatabase = require("./src/config/initDatabase");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start BookNest:", error.message);
        await pool.end();
        process.exitCode = 1;
    }
}

startServer();
