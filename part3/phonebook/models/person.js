const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

//Connecting to database.
const url = process.env.MONGODB_URI;
console.log("connecting to:", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB: ", error.message);
  });

//Schema.
const personSchema = new mongoose.Schema({ name: String, number: String });
const Person = mongoose.model("Person", personSchema);

//Transform the returned object and remove _id and __v.
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Person;
