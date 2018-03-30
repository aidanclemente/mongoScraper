$("#scrapeArticles").on("click", function(event) {
    event.preventDefault();
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .done(function(data) {
        console.log(data);
        window.location = "/";
    });
});

$("#homeButton").on("click", function(event) {
    event.preventDefault();
    window.location = "/"
})

$(document).on("click", ".saveArticle", function(event) {
    event.preventDefault();
    var id = $(this).data("id");
    var saved = $(this).data("saved")

    console.log(id);

    $.ajax({
        methold: "POST",
        url: "/articles/" + id + "/" + saved
    }).done(function(data) {
        console.log(data);

        if (data.saved) {
            alert("This article has been saved");
        }
        else {
            location.reload();
        }
    });

});