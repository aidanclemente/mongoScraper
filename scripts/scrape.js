var cheerio = require("cheerio");
var axios = require("axios");
var db = require(".././models");

const scrapePage = function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {

        var $ = cheerio.load(response.data);

        $("article.theme-summary").each(function(i, element) {
            var result = {};
            
            result.title = $(this)
                .children("h2.story-heading")
                .children("a")
                .text();
            result.summary = $(this)
                .find(".summary")
                .text();
            result.link = $(this)
                .children("h2.story-heading")
                .find("a")
                .attr("href");

            if ( (result.title && result.summary && result.link) ) {   
                console.log(result)
            }

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