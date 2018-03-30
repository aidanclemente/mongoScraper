var cheerio = require("cheerio");
var axios = require("axios");
var db = require(".././models");

const scrapePage = function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {

        var $ = cheerio.load(response.data);
        console.log("=============");
        console.log(response.data);
        $("h2.story-heading").each(function(i, element) {
            var result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.summary = $(this)
                .children("p.summary")
                .text();
            result.link = $(this)
                .find("a")
                .attr("href");

      db.Headline.create(result)
        .then(function(dbHeadline) {
          console.log(dbHeadline);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
}

module.exports = scrapePage;