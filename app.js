const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const sequelize = require("./src/db/sequelize");

const app = express();
const port = 3000;

// middleware
app
  .use(favicon(__dirname + "/assets/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

// initialization sequelize db
sequelize.initDb();

require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonByPk")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);

app.listen(port, () =>
  console.log(
    `Notre application Node est demaree sur : http://localhsot:${port}`
  )
);
