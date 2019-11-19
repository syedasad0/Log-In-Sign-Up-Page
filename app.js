const express = require('express');
const app = express();
const Joi = require('joi');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const db = require('./mysqlservices');


app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', function (req, res) {
    console.log("Log In");
    res.sendFile('/home/syed/Desktop/Project/login.html');
});
app.post('/login', function (req, res) {
    console.log(req.body);
    const schema = Joi.object().keys({
        id: Joi.string().trim().email().required(),
        password: Joi.string().min(5).max(12).required()
    });
    Joi.validate(req.body, schema, (err, x) => {
        console.log(err);
        if (err) {
            return res.send("Validation Error");
        }
        let sqlQuery = 'select * from user_cred where email = \'' + req.body.id + '\'';
        console.log(sqlQuery);
        db.query(sqlQuery, (err, rows) => {
            if (err) {
                return res.send("Some Error Occured!");
            }
            if (rows.length > 0) {
                if(rows[0].password!=req.body.password) {
                    return res.send("Password Not Matched");
                }
                //res.send(rows);
                res.sendFile('/home/syed/Desktop/Project/home.html');
            }
            else {
                res.send("Email Not Registered");
            }
        });
    });
});




app.get('/signup', function (req, res) {
    res.sendFile('/home/syed/Desktop/Project/signup.html')
});

app.post('/signup', function (req, res) {
    console.log("Received request data - ", req.body);
    //joiPackage
    const schema2 = Joi.object().keys({
        firstName: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        lastName: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        id: Joi.string().trim().email().required(),
        password: Joi.string().min(5).max(12).required()
    });
    Joi.validate(req.body, schema2, (err, x)=>{
        console.log(err);
        if (err) {
            return res.send("Validation Error");
        }
    // (first_name, last_name, email, password)
    let sqlQuery = 'INSERT INTO user_cred  VALUES(\'' + req.body.firstName.toString() + '\' , \'' + req.body.lastName.toString() + '\', \'' + req.body.id.toString() + '\', \'' + req.body.password.toString() + '\' )';

    console.log(sqlQuery);

    db.query(sqlQuery, (err, rows) => {
        if (err) {
            //  console.log(err);
            return res.send("Some Error Occured!");
        }
        res.sendFile('/home/syed/Desktop/Project/home.html')
        //res.send("Rows Entered");
    });
});
});

app.listen(3000);
console.log("Server Listening at 3000");