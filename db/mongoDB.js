const url = "mongodb://localhost/nodeJsProject_shopping";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
module.exports = db;
