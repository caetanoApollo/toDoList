const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'SEU_USER',
    password: 'SUA_SENHA',
    database: 'todo_app'
});

db.connect((err) => {
    if (err) {
        throw err
    } else{
        console.log('Conectado ao banco de dados')
    }
});

module.exports = db;
