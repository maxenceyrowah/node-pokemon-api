const express = require("express");
const { success, getUniqueId } = require("./helper.js");
const { Sequelize } = require("sequelize");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
let pokemons = require("./pokemons");

const app = express();
const port = 3000;

// sequelize initialization
const sequelize = new Sequelize("pokedex", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion a la base de donnée a bien été établie")
  )
  .catch((error) =>
    console.error(`Impossible de se connecter a la base de données ${error}`)
  );

// middleware
app
  .use(favicon(__dirname + "/assets/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello again, Express 2 ! 👋"));

// get  pokemons
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

// edit pokemon
app.put("/api/pokemons/:id", (req, res) => {
  const id = +req.params.id;
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((p) => {
    return p.id === id ? pokemonUpdated : p;
  });

  const message = `Le pokémon ${pokemonUpdated.name} a bien été modifé.`;
  res.json(success(message, pokemonUpdated));
});

// delete pokemon
app.delete("/api/pokemons/:id", (req, res) => {
  const id = +req.params.id;
  const pokemonDeleted = pokemons.find((p) => p.id === id);
  pokemons = pokemons.filter((p) => p.id !== id);

  const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé`;
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est demaree sur : http://localhsot:${port}`
  )
);
