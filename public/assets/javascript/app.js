// Click function to Scrapes the Articles
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

// Go to homepage
$("#homeButton").on("click", function(event) {
    event.preventDefault();
    window.location = "/"
})

// Handles button click for saving an article and removing an article from saved
$(document).on("click", ".saveArticle, .deleteArticle", function(event) {
    event.preventDefault();
    var id = $(this).data("id");
    var saved = $(this).data("saved")

    console.log(id);

    $.ajax({
        method: "PUT",
        url: "/articles/" + id + "/" + saved
    }).done(function(data) {
        console.log(data);

        if (data.saved) {
            alert("This article has been saved");
        }
        else {
            alert("This article has been deleted from your saved Articles.");
            location.reload();
        }
    });

    // Article Notes Modal
    $("#notesModal").on('shown.bs.modal', function (event) {
        event.preventDefault();
        $('#myInput').trigger('focus')
      })
});