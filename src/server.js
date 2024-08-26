require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations");

const AppError = require("./utils/AppError"); // utils para tratar erros

const express = require("express");

const routes = require("./routes"); //importa todas as rotas do index.js

migrationsRun(); // executa as migrations

const app = express(); // inicializando o express
app.use(express.json()); // estabelece o padrão JSON para req e res.

app.use(routes); // usa todas as rotas da api

// TRATAMENTO DE ERRO
app.use((error, req, res, next) => {
  // se for um error gerado pelo cliente
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(err); // para debugar os erros

  // se for error do servidor
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error"
  });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
