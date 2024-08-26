const { Router } = require("express");

// Importação dos controllers
const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();

// Instanciando os controllers
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/:id", usersController.update);

module.exports = usersRoutes;
