require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

//Middleware.
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

//Create a custom token req-body.
morgan.token("req-body", (req, res) => JSON.stringify(req.body));

//Create custom formatting for logging.
const postFormat =
  ":method :url :status :res[content-length] - :response-time ms :req-body";
app.use(morgan(postFormat));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/info", (request, response) => {
  const personsCount = persons.length;
  const currentTimeDate = new Date();
  response.send(
    `<p>Phonebook has info for ${personsCount} persons</p> <p>${currentTimeDate}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((deletedPerson) => {
    response.json(deletedPerson);
  });

  // response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number)
    return response
      .status(400)
      .json({ error: "The name or number is missing." });

  const newPerson = new Person({ name, number });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });

  // const existingName = persons.find(
  //   (person) => person.name.toLowerCase() === name.toLowerCase()
  // );

  // if (existingName)
  //   return response.status(409).json({ error: "Name must be unique." });

  // const personId = Math.floor(Math.random() * 1e6).toString();
  // const newPerson = { ...request.body, id: personId };

  // persons.push(newPerson);
  // response.status(201).json(newPerson);
});

//Unknown endpoint middleware.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint " });
};
app.use(unknownEndpoint);

//Error handler middleware.
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
