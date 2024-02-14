const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");
const authMiddleware = require("../auth/auth");

module.exports = (app) => {
  app.get("/api/pokemons", authMiddleware, (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      const limit = +req.query.limit || 5;

      if (name.length < 2) {
        const message =
          "Le terme de recherche doit contenir au minimum 2 caracteres";
        return res.status(400).json({ message });
      }

      return Pokemon.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        order: ["name"],
        limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} qui correspondent au terme de recherche ${name}`;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((err) => {
          const message = `La liste des pokemons n'a pas pu être recupérée. Ressayez dans quelques instants.`;
          res.status(500).json({ message, data: err });
        });
    }
  });
};
