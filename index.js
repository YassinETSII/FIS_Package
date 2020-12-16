var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb')

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

//In order to obtain all the packages we execute the next request
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

//In order to create a package we execute the next request
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

//In order to update a package we execute the next request
app.put(BASE_API_PATH + "/packages/:id",
    (req,res) => {
        console.log(Date() + " - PUT /packages/" + req.params.id);
        db.update({"_id":req.params.id}, 
        {$inc:{code: -req.body.code},
        $set:{quantity: req.body.quantity}
        $set:{product: req.body.product}
        $set:{deliveryDate: req.body.deliveryDate}
        $set:{order: req.body.order}}, (err) => {
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
