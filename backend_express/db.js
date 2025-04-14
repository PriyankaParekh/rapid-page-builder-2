const mongoose = require("mongoose");
const url =
  "mongodb+srv://parekhjainam229:W1xnsWFpStGuUH2P@cluster0.hgklfv1.mongodb.net/pageBuilder";
const connection = mongoose.connect(url);

connection
  .then(() => {
    console.log("successfully connected to DB");
  })
  .catch((err) => {
    console.log("Error in connection", err);
  });