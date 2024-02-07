const express = require("express");
const { success, getUniqueId } = require("./helper.js");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
let pokemons = require("./pokemons");

const app = express();
const port = 3000;

// middleware
app
  .use(favicon(__dirname + "/assets/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello again, Express 2 ! 👋"));

// get all pokemons
app.get("/api/pokemons", (req, res) => {
  const message = "La liste des pokémons a bien été recupérée";
  res.json(success(message, pokemons));
});

// get pokemon
app.get("/api/pokemons/:id", (req, res) => {
  const id = +req.params.id;
  const pokemon = pokemons.find((p) => p.id === id);
  const message = "Un pokémon a bien été trouvé";

  res.json(success(message, pokemon));
});

// create a new pokemon
app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokémon ${pokemonCreated.name} a bien été crée`;

  res.json(success(message, pokemonCreated));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est demaree sur : http://localhsot:${port}`
  )
);
