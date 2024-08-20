const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

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
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number)
    return response
      .status(400)
      .json({ error: "The name or number is missing." });

  const existingName = persons.find(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );

  if (existingName)
    return response.status(409).json({ error: "Name must be unique." });

  const personId = Math.floor(Math.random() * 1e6).toString();
  const newPerson = { ...request.body, id: personId };

  persons.push(newPerson);
  response.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
