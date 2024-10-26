const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '904200339700',
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
