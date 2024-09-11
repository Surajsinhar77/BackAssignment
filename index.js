const {app} = require("./src/app/app");

const PORT = process.env.PORT || 8000;


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  // Send a generic error response
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred. Please try again later.",
  });
});