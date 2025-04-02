const app = require("./app");
const PORT = process.env.PORT || 5000;

// // Define a route
// app.get("/", (req, res) => {
//   res.render("index", { title: "San Arts" });
// });

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
