var headlineController = require("../../controllers/headline.js");


module.exports = function(app) {
    app.get("/", headlineController.renderHome);
    app.get("/saved", headlineController.renderSaved);
  };
  