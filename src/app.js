const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;
    
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id == id);

  console.log(repositoryIndex);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  var likes = repositories[repositoryIndex].likes;

  const newLikes = repositories[repositoryIndex].likes = likes + 1;

  return response.json({ likes: newLikes });
});

module.exports = app;
