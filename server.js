const express = require('express'); // webserver
const hbs = require('hbs'); //handlebars - view engine
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials'); // for including separate hbs files such as headers / footers
app.set('view engine', 'hbs');


//use using a middleware to store logs for requests coming to the server
//important to call the next(); function at the end otherwise server will be stuck at the middle point
app.use((req, res, next) => { //express's.use function to use any kind of middleware
  var now = new Date().toString(); // toString converts the date object into human readable date
  var log = `${now}: ${req.method} ${req.url}`;

  fs.appendFile('server.log', log + '\n', (e) => {
    console.log('Unable to write');
  });
  next();
});

//app.use or express's use function can also be used to redirect whole site to a page like maintenance mode.
// it is just like server taking request, processing middleware, sending to next middleware and so on..
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//moved it under the maintenance middleware so that it affects public directory as well.
app.use(express.static(__dirname + '/public')); // for including a static directory visible to public

hbs.registerHelper('getCurrentYear', () => { // register any function which can be called by the view template pages
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => { // a helper is to take arguments from view and parse it back to the view
  return text.toUpperCase();
});


app.get('/',(req, res) => {
  res.render('home.hbs',{
    welcomeMessege: 'Hi Soumik!',
    pageTitle: 'Home Page'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMesseage : 'Unable to open the page',
  });
})

//heroku is going to setup the port so we need to use environment variable

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});













/**/
