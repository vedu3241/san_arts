const express = require("express");
const app = express();
//add cors
const cors = require("cors");
//use cors
app.use(cors());
//import routes here
const homeRoutes = require("./routes/homeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Serve static files
app.use(express.static("public"));

//routes
app.use("/api", homeRoutes);
app.use("/api/gallery", galleryRoutes);

//admin
app.use("/api/admin", adminRoutes);

module.exports = app;
