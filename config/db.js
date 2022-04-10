// Importing MySQL module
const mysql = require("mysql");
  
// Creating connection
let db_con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});
  
console.log({
  host            : process.env.MYSQL_HOST,
  user            : process.env.MYSQL_ROOT_USER,
  password        : process.env.MYSQL_ROOT_PASSWORD,
  database        : process.env.MYSQL_DATABASE
})
// Connect to MySQL server
db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("connected to Database");
  }
});
  
module.exports = db_con;