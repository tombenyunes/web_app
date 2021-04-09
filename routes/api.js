module.exports = function (app)
{
    const { foodValidation } = require('../lib/validationChecks');
    const { validationResult } = require('express-validator/src/validation-result');

	app.get('/api/', function (req, res)        // respond with all foods
	{
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;
        MongoClient.connect(url, function (err, client) {
            if (err) throw err      // catch errors
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_FOODS).find().toArray((err, results) => {   // find all foods in collections
                if (err) throw err;
                else res.status(200).json(results); // success
                client.close();
            });
        });
	});

    app.get('/api/:foodId', function (req, res)     // respond with the food that matches the specified ID
	{
        if (req.params.foodId.length != 24) {
            res.status(400).send('BAD REQUEST: ID length must be 24 characters exactly!');  // if the ID is incorrectly formed
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;
            MongoClient.connect(url, function (err, client) {
                if (err) throw err
                var db = client.db(process.env.DATABASE_NAME);

                const objectID = require('mongodb').ObjectID;   // convert the mongo id to objectID format (otherwise it can't be correctly evaluated against)
                const id = new objectID(req.params.foodId);

                db.collection(process.env.COLLECTION_FOODS).find({
                    _id: id
                }).toArray((err, results) => {
                    if (err) throw err;
                    else {
                        if (results.length == 0) {
                            res.status(404).json("NOT FOUND");      // no food item matches the ID
                        } else {
                            res.status(200).json(results);      // success - match found
                        }
                    }
                    client.close();
                });
            });
        }
	});

    app.post('/api', foodValidation, function (req, res)        // add new food item
	{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {    // check for errors
            let errMsg = "";
            for (i = 0; i < errors.errors.length; i++) {
                errMsg += errors.errors[i].param + ": " + errors.errors[i].msg;
                if (i < errors.errors.length - 1) {
                    errMsg += ", ";                     // collects express validation error messages in a list
                } else {
                    errMsg += ".";
                }
            }
            res.status(400).send('BAD REQUEST: ' + errMsg);     // return error code and messages
        }
        else if (!req.body.author) {
            res.status(400).send('BAD REQUEST: ' + 'Author Must be Defined');   // food author required
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                db.collection(process.env.COLLECTION_FOODS).insertOne({     // insert food item into collection
                    name: req.body.name,
                    price: req.body.price,
                    typicalValues: req.body.typicalValues,
                    typicalValuesUnit: req.body.typicalValuesUnit,
                    calories: req.body.calories,
                    carbohydrates: req.body.carbohydrates,
                    fat: req.body.fat,
                    protein: req.body.protein,
                    salt: req.body.salt,
                    sugar: req.body.sugar,
                    author: req.body.author
                });
                client.close();

                res.status(201).send('CREATED: Food Added Successfully');
            });
        }
	});
    
    app.put('/api/:foodId*?', foodValidation, function (req, res)       // update food item
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errMsg = "";
            for (i = 0; i < errors.errors.length; i++) {
                errMsg += errors.errors[i].param + ": " + errors.errors[i].msg;
                if (i < errors.errors.length - 1) {
                    errMsg += ", ";                 // collects express validation error messages in a list
                } else {
                    errMsg += ".";
                }
            }
            res.status(400).send('BAD REQUEST: ' + errMsg);     // return error code and messages
        }
        else if (!req.params.foodId) {
            res.status(400).send('BAD REQUEST: No ID Specified');
        }
        else if (req.params.foodId.length != 24) {
            res.status(400).send('BAD REQUEST: ID length must be 24 characters exactly!');      // IDs must be 24 chars
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;
            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                const objectID = require('mongodb').ObjectID;       // convert the mongo id to objectID format (otherwise it can't be correctly evaluated against)
                const id = new objectID(req.params.foodId);

                db.collection(process.env.COLLECTION_FOODS).findOneAndUpdate({
                    _id: id
                },
                {
                    $set:       // update food item in collection
                    {
                        name: req.body.name,
                        price: req.body.price,
                        typicalValues: req.body.typicalValues,
                        typicalValuesUnit: req.body.typicalValuesUnit,
                        calories: req.body.calories,
                        carbohydrates: req.body.carbohydrates,
                        fat: req.body.fat,
                        protein: req.body.protein,
                        salt: req.body.salt,
                        sugar: req.body.sugar
                    }
                },
                function (err, results) {
                    if (err) throw err;
                    else {
                        if (!results.value) {
                            res.status(404).send("NOT FOUND");      // food not found with specified ID
                        } else {
                            res.status(200).send('UPDATED: Food (id: ' + req.params.foodId + ') Updated Successfully'); // success message
                        }
                    }
                });
                client.close();
            });            
        }
    });

    app.delete('/api/:foodId*?', function (req, res)        // delete food item
    {
        if (!req.params.foodId) {
            res.status(400).send('BAD REQUEST: No ID Specified');
        }
        else if (req.params.foodId.length != 24) {
            res.status(400).send('BAD REQUEST: ID length must be 24 characters exactly!');
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;
            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                const objectID = require('mongodb').ObjectID;       // convert the mongo id to objectID format (otherwise it can't be correctly evaluated against)
                const id = new objectID(req.params.foodId);

                db.collection(process.env.COLLECTION_FOODS).findOneAndDelete({
                    _id: id                 // find and delete food item that matches specified ID
                },
                function (err, results) {
                    if (err) throw err;
                    else {
                        if (!results.value) {
                            res.status(404).send("NOT FOUND");      // food not found with specified ID
                        } else {
                            res.status(200).send('DELETED: Food (id: ' + req.params.foodId + ') Deleted Successfully');     // success message
                        }
                    }
                });
                client.close();
            });            
        }
    });
}