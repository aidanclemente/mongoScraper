var db = require("../models");

module.exports = {
    renderHome: function(req, res) {
        db.Headline.find({}, function(error, data) {
            // console.log(data);
            var hbsObject = {
                headline: data
            }
            console.log(hbsObject);
            res.render("home", hbsObject);    
        })
          
    },
    renderSaved: function(req, res) {
        var hbsObject;
        res.render("saved", hbsObject);
    }

}