var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

// Set Handlebars.
var exphbs = require("express-handlebars");

// Require all models this will be moved with the routes
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

// Apparently, all we need to require is the routes, and the each file from there requires the others


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
    // If we were able to successfully find an Article with the given id, send it back to the client
    res.json(dbHeadlineById);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id/:saved", function(req, res) {

  db.Headline.findOneAndUpdate({ _id: req.params.id }, { saved: req.param.saved}, { new: true })

     
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

  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // IF a Note was created successfully, find one Article with and _id = req.params.id  

      //Update the Article to be associated with the new Note { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    
      return db.Headline.findOneAndUpdate({ _id: req.params.id }, {note: dbNote._id }, { new: true });
    })
    // Since our mongoose query returns a promise, we can chain another .then which receives the result of the query
    .then(function(dbHeadline) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbHeadline);
    })
    .catch(function(err) {
      // If an error occured, send it to the client
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
