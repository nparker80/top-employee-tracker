const mysqli = require('mysql');
require('dotenv').config();

connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'DB_User',
  password: 'DB_Password',
  database: 'DB_Name',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.log(chalk.white.bgRed(err));
    return;
  }
  console.log(chalk.green(`Connected to database. ThreadID: ${connection.threadId}`));
})

module.exports = connection;