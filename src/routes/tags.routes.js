const { Router } = require("express");

// Importação dos controllers
const TagsController = require("../controllers/TagsController");

const tagsRoutes = Router();

// Instanciando os controllers
const tagsController = new TagsController();

tagsRoutes.get("/:user_id", tagsController.index);

module.exports = tagsRoutes;
