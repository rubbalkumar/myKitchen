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
    
});

app.get('/', (req, res) => {
    //Store into recipe
//     var sql = "INSERT INTO recipes (title, instructions, owner, picture, time) VALUES ('Tomato Sauce With Onion & Butter', 'Put either the prepared fresh tomatoes or the canned in a saucepan, add the butter, onion, and salt, and cook uncovered at a very slow, but steady simmer for about 45 minutes, or until it is thickened to your liking and the fat floats free from the tomato. Stir from time to time, mashing up any large pieces of tomato with the back of a wooden spoon. Taste and correct for salt. Before tossing with pasta, you may remove the onion (as Hazan recommended) and save for another use, but many opt to leave it in. Serve with freshly grated parmigiano-reggiano cheese for the table.', 'Marcella Hazan', 'https://www.creative-culinary.com/wp-content/uploads/tomato-butter-onion.jpg', '60 mins');";
//     connection.query(sql, function (err, result) {
//     if (err) throw err;
//   });

    //Store into ingredients
//   var sql = "INSERT INTO requirements (id, title, ingredients) VALUES (3,'Tomato Sauce With Onion & Butter','tomatoes'), (3,'Tomato Sauce With Onion & Butter','butter'), (3,'Tomato Sauce With Onion & Butter','onion'),(3,'Tomato Sauce With Onion & Butter','salt');";
//     connection.query(sql, function (err, result) {
//     if (err) throw err;
//   });

//     var sql = "select * from recipes";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     res.send(result2);
// });

    // var sql = "select * from requirements";
    //     connection.query(sql, function (err, result2) {
    //     if (err) throw err;
    //     res.send(result2);
    // });

//     var sql = "select * from users";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     res.send(result2);
// });

// var sql = "ALTER TABLE ingredients RENAME TO requirements;";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     //res.send(result2);
// });

// var sql = "DROP TABLE ingredients";
//     connection.query(sql, function (err, result2) {
//     if (err) throw err;
//     res.send(result2);
// });


});



app.listen(3000, () => {
    console.log('listening from 3000');
});