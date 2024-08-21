const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

//MongoDB connection.
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.mrjajor.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

//Schema.
const personSchema = new mongoose.Schema({ name: String, number: String });
const Person = mongoose.model("Person", personSchema);

//Add person to MongoDB.
const name = process.argv[3];
const number = process.argv[4];
const person = new Person({ name, number });
person.save().then((result) => {
  console.log(`Added ${result.name} with number ${result.number} to phonebook`);
});

Person.find({}).then((result) => {
  console.log("Phonebook: ");
  result.map((r) => console.log(`${r.name} ${r.number}`));
  mongoose.connection.close();
});
