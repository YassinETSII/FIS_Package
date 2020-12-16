var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb')
//nedb is for database purposes

var port = (process.env.PORT || 3000);
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + "/packages.json";

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

//TODO: Add DB final name once it's done
var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true
});

app.get("/", (req, res) => {
    res.send("<html><body><h1>Shall we look up for your packages?</h1></body></html>");
});

//In package to obtain all the packages we execute the next request
app.get(BASE_API_PATH + "/packages", (req, res) => {
    console.log(Date() + " - GET /packages");

    db.find({}, (err, packages) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.send(packages.map((package) => {
                delete package._id;
                return package;
                res.sendStatus(200);
            }));
        }
    });
});

//In package to crate an package we execute the next request
app.post(BASE_API_PATH + "/packages", (req, res) => {
    console.log(Date() + " - POST /packages");
    var package = req.body;
    db.insert(package, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

app.listen(port);

console.log("Server ready!")
