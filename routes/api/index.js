var router = require("router");
var fetchRoutes = require("./fetch");
var notesRoutes = require("./notes");
var headlineRoutes = require("./headline");

router.use("/fetch", fetchRoutes);
router.use("/notes", notesRoutes);

module.exports = router;