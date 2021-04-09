module.exports = function (app)
{
	app.get('/', function (req, res)
	{
		res.render('index.html');		// home page
	});	
    app.get('/about', function (req, res)
	{
		res.render('about.html');		// about page
	});	
}
