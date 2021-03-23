module.exports = function (app)
{
    const utils = require('../lib/utils.js');

    // admin database management, clear database
	app.get('/deleteall', utils.redirectAdmin, (req,res) => 
	{
		var MongoClient = require('mongodb').MongoClient;
		var url = process.env.DATABASE_PATH;

		MongoClient.connect(url, function (err, client)
		{
			if (err) throw err;
			var db = client.db(process.env.DATABASE_NAME);
			db.collection('users').deleteMany({}); // delete all from 'users'
			db.collection('foods').deleteMany({}); // delete all from 'foods'
			
			let title = 'Success';
			let message = 'All data has been cleared.';
			res.render('templates/messageTemplate.html', {title: title, message: message, multipleMessages: false, color: '#6a9955'}); // success message
		});
	});
}