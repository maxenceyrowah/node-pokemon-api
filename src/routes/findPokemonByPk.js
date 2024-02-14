const { Pokemon } = require("../db/sequelize");
const authMiddleware = require("../auth/auth");

module.exports = (app) => {
  app.get("/api/pokemons/:id", authMiddleware, (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then((pokemon) => {
        if (pokemon === null) {
          const message =
            "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant.";
          return res.status(404).json({ message });
        }

        const message = "Un pokémon a bien été trouvé.";
        res.json({ message, data: pokemon });
      })
      .catch((err) => {
        const message = `Le pokemon n'a pas pu être recupéré. Ressayez dans quelques instants.`;
        res.status(500).json({ message, data: err });
      });
  });
};
