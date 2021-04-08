module.exports = function (app)
{
    const { foodValidation } = require('../lib/validationChecks');
    const { validationResult } = require('express-validator/src/validation-result');

	app.get('/api/', function (req, res)
	{
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;
        MongoClient.connect(url, function (err, client) {
            if (err) throw err
            var db = client.db(process.env.DATABASE_NAME);

            db.collection(process.env.COLLECTION_FOODS).find().toArray((err, results) => {
                if (err) throw err;
                else res.status(200).json(results);
                client.close();
            });
        });
	});
    app.get('/api/:foodId', function (req, res)
	{
        if (req.params.foodId.length != 24) {
            res.status(400).send('BAD REQUEST: ID length must be 24 characters exactly!');
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;
            MongoClient.connect(url, function (err, client) {
                if (err) throw err
                var db = client.db(process.env.DATABASE_NAME);

                const objectID = require('mongodb').ObjectID;
                const id = new objectID(req.params.foodId);

                db.collection(process.env.COLLECTION_FOODS).find({
                    _id: id
                }).toArray((err, results) => {
                    if (err) throw err;
                    else {
                        if (results.length == 0) {
                            res.status(404).json("NOT FOUND");
                        } else {
                            res.status(200).json(results);
                        }
                    }
                    client.close();
                });
            });
        }
	});

    app.post('/api', foodValidation, function (req, res)
	{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errMsg = "";
            for (i = 0; i < errors.errors.length; i++) {
                errMsg += errors.errors[i].param + ": " + errors.errors[i].msg;
                if (i < errors.errors.length - 1) {
                    errMsg += ", ";
                } else {
                    errMsg += ".";
                }
            }
            res.status(400).send('BAD REQUEST: ' + errMsg);
        }
        else if (!req.body.author) {
            res.status(400).send('BAD REQUEST: ' + 'Author Must be Defined');
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                db.collection(process.env.COLLECTION_FOODS).insertOne({
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
    
    app.put('/api/:foodId*?', foodValidation, function (req, res)
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errMsg = "";
            for (i = 0; i < errors.errors.length; i++) {
                errMsg += errors.errors[i].param + ": " + errors.errors[i].msg;
                if (i < errors.errors.length - 1) {
                    errMsg += ", ";
                } else {
                    errMsg += ".";
                }
            }
            res.status(400).send('BAD REQUEST: ' + errMsg);
        }
        else if (!req.params.foodId) {
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

                const objectID = require('mongodb').ObjectID;
                const id = new objectID(req.params.foodId);

                db.collection(process.env.COLLECTION_FOODS).findOneAndUpdate({
                    _id: id
                },
                {
                    $set:
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
                            res.status(404).send("NOT FOUND");
                        } else {
                            res.status(200).send('UPDATED: Food (id: ' + req.params.foodId + ') Updated Successfully');
                        }
                    }
                });                
                client.close();
            });            
        }
    });

    app.delete('/api/:foodId*?', function (req, res)
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

                const objectID = require('mongodb').ObjectID;
                const id = new objectID(req.params.foodId);

                db.collection(process.env.COLLECTION_FOODS).findOneAndDelete({
                    _id: id
                });
                client.close();
            });

            res.status(200).send('DELETED: Food (id: ' + req.params.foodId + ') Deleted Successfully');
        }
    });
}