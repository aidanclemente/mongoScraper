var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// var methodOverride = require("method-override");

// Set Handlebars.
var exphbs = require("express-handlebars");

// Require all models 
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Setting up handlebars as the view engine and setting the default page to home.handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoScraper");

// ------- Database config with Mongoose -----
// Define local MongoDB URI 
var databaseUri = 'mongod://localhost/week18day3mongoose';
// ---------------------------------

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
 var monDB = mongoose.connection;

 // show any mongoose errors
 monDB.on('error', function(err) {
   console.log('Mongoose Error: ', err);
 });

 // once logged in to the database through mongoose, log a success message

 monDB.once('open', function() {
   console.log('Mongoose connnection successful.');
 });

var scrapePage = require("./scripts/scrape.js");

// ======= Routes =====
require("./routes/view/htmlRoutes")(app);
// require("./routes/apiRoutes")(app);

// A GET route for scraping the nytimes website
app.get("/scrape", scrapePage);


// -------- Articles ---------

// Get all Articles from the db
app.get("/articles", function(req, res) {

  db.Headline.find({})
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get all saved Articles
app.get("/saved", function(req, res) {
  console.log("Getting Saved Articles");

  db.Headline.find({
    saved: true
  })
  .then(function(dbHeadline) {
    res.render("saved", {headline: dbArticle})
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Get specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

  db.Headline.findOne({
    _id: req.params.id
  })
  .populate("note")
  .then(function(dbHeadlineById) {
    res.json(dbHeadlineById);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.put("/articles/:id/:saved", function(req, res) {
 console.log(req.param.id)
  db.Headline.findOneAndUpdate({ _id: req.params.id }, {$set:{ saved: req.params.saved}}, { new: true })
      .then(function(dbHeadline) {
        console.log("Saved an article");
        res.json(dbHeadline);
      })
      .catch(function(err) {
        res.json(err);
      });
  }); 


// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Headline.findOneAndUpdate({ _id: req.params.id }, {note: dbNote._id }, { new: true });
    })
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
