


// create pool or connection

const mysql = require('mysql2')
exports.promisePool = mysql.createPool(
    {
        host:     '127.0.0.1', // <== Update
        user:     'root', //
         port:    "3306" ,
        password: '1992', // <== Update
        database: 'nodejsschema'  // <== Update
    }).promise()
