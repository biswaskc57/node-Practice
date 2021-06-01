const express = require("express");

const app = express();
app.use(express.json());

app.use(express.static("build"));
const morgan = require("morgan");
morgan.token("body", (req, res) => JSON.stringify(req.body));

const cors = require("cors");
app.use(cors());
//:body comes from morgan.token("body",...)
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body ")
);

require("dotenv").config();
const Note = require("./models/note");

/*
note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});*/

app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log(request.params);
  console.log(request.body);

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    date: new Date(),
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
    console.log(savedNote);
  });
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
