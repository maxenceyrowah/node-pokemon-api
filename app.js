const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const sequelize = require("./src/db/sequelize");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app
  .use(favicon(__dirname + "/assets/favicon.ico"))
  .use(bodyParser.json())
  .use(cors());

// init heroku app
app.get("/", (req, res) => {
  res.json("Hello, Heroku!");
});

// initialization sequelize db
sequelize.initDb();

// endpoint of pokemons
require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonByPk")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);

// endpoint of user
require("./src/routes/login")(app);

// gestion des erreurs
/// cas du status code 404
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressoucre demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(
    `Notre application Node est demaree sur : http://localhsot:${port}`
  )
);
