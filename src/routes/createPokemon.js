const { Pokemon } = require("../db/sequelize");
const { ValidationError, UniqueContrainError } = require("sequelize");
const authMiddleware = require("../auth/auth");

module.exports = (app) => {
  app.post("/api/pokemons", authMiddleware, (req, res) => {
    Pokemon.create(req.body)
      .then((pokemon) => {
        const message = `Le pokémon ${req.body.name} a bien été crée.`;
        res.json({ message, data: pokemon });
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          return res.status(400).json({ message: err.message, data: err });
        }

        if (err instanceof UniqueContrainError) {
          return res.status(400).json({ message: err.message, data: err });
        }

        const message = `Le pokemon n'a pas pu être rajouté. Ressayez dans quelques instants.`;
        res.status(500).json({ message, data: err });
      });
  });
};
