const validTypes = [
  "Plante",
  "Poison",
  "Feu",
  "Eau",
  "Insecte",
  "Vol",
  "Normal",
  "Electrik",
  "Fée",
];
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: {
          msg: "Le nom est déja pris",
        },
        allowNull: false,
        validate: {
          notEmpty: { msg: "Le nom d'un pokemon ne peut etre vide" },
          notNull: { msg: "Le nom est une propriete requise" },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utiliser uniquement des nombres entiers pour les points de vie.",
          },
          min: {
            args: [0],
            msg: "Champ requis, nombre entre 0 et 999",
          },
          max: {
            args: [999],
            msg: "Champ requis, nombre entre 0 et 999",
          },
          notNull: { msg: "Les points de vie sont une propriete requise" },
        },
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utiliser uniquement des nombres entiers pour la capacite.",
          },
          notNull: {
            msg: "La capacite d'un pokemon est une propriete requise",
          },
          min: {
            args: [0],
            msg: "Champ requis, nombre entre 0 et 99",
          },
          max: {
            args: [99],
            msg: "Champ requis, nombre entre 0 et 99",
          },
        },
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: { msg: "Le photo d'un pokemon doit etre une URL valide" },
          notNull: { msg: "La photo d'un pokemon est une propriete requise" },
        },
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("types").split(",");
        },
        set(types) {
          this.setDataValue("types", types.join());
        },
        validate: {
          isTypesValid(value) {
            if (!value) {
              throw new Error("Un pokemon doit au moins avoir un type");
            }

            if (value.split(",").length > 3) {
              throw new Error("Un pokemon ne peut avoir plus de trois types");
            }
            value.split(",").forEach((type) => {
              if (!validTypes.includes(type)) {
                throw new Error(
                  `Le type d'un pokemon doit appartenir a la liste suivante: ${validTypes}`
                );
              }
            });
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};
