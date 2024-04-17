const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "saarthi",
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to MySQL:", error.message);
        return;
    }
    console.log("Connected to MySQL");
});

module.exports = connection;
