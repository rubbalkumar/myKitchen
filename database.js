const express = require('express');
const mysql = require('mysql');
const app = express();

var connection = mysql.createConnection({
    host: 'mykitchen.c3jx8fklyfbq.us-east-2.rds.amazonaws.com',
    user: 'mykitchen',
    password: 'mykitchen',
    database: 'mykitchen',
    timeout: 60000
});
app.use('/views', express.static('views'));
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    
    //creating the recipe table
//     var sql = "CREATE TABLE recipes(id int AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), instructions LONGTEXT, owner VARCHAR(255), picture TEXT(255), time VARCHAR(255))";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
// });

    // Creating the requirements table
    // var sql = "CREATE TABLE requirements(id int, title VARCHAR(255), ingredients VARCHAR(255))";
    // connection.query(sql, function (err, result2) {
    // if (err) throw err;
    // });

    // Creating the user account table
    // var sql = "CREATE TABLE users(id int AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), googleid VARCHAR(255), picture TEXT(255), bookmarked int, contributed int)";
    // connection.query(sql, function (err, result2) {
    // if (err) throw err;
    // });

    // Creating the pantry/shopping list
    // var sql = "CREATE TABLE pantry(id int, ingredients VARCHAR(255))";
    // connection.query(sql, function (err, result2) {
    // if (err) throw err;
    // });
    
});

app.get('/', (req, res) => {
    //Store into recipe
//     var sql = "INSERT INTO recipes (title, instructions, owner, picture, time) VALUES ('Lemonade', 'Take a glass of cold water and squeeze some lemon juice into it. Add sugar and a pinch of salt. Mix until everything is dissolved. Enjoy!', 'Sukriti Sinha', 'https://thebusybaker.ca/wp-content/uploads/2018/04/healthy-3-ingredient-lemonade-3.jpg', '5 mins');";
//     connection.query(sql, function (err, result) {
//     if (err) throw err;
//   });

    //Store into ingredients
//   var sql = "INSERT INTO requirements (id, title, ingredients) VALUES (4,'Lemonade','lemon'), (4,'Lemonade','water'), (4,'Lemonade','salt'),(4,'Lemonade','sugar');";
//     connection.query(sql, function (err, result) {
//     if (err) throw err;
//   });



    // var sql = "INSERT INTO recipes (ingredients) VALUES   ('lemon, water, sugar, salt')";
    //     connection.query(sql, function (err, result2) {
    //     if (err) throw err;
    //     res.send(result2);
    // });

//     var sql = "select * from users";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     res.send(result2);
// });

// var sql = "UPDATE recipes SET ingredients = ('lemon, water, sugar, salt') WHERE id = 4";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     //res.send(result2);
// });

// var sql = "DROP TABLE ingredients";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     res.send(result2);
// });

    var sql = "select * from users";
    connection.query(sql, function (err, result2) {
    if (err) throw err;
    res.send(result2);
});


});



app.listen(3000, () => {
    console.log('listening from 3000');
});