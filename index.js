var express = require("express");
let { game, board } = require("./game");
var app = express();
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let boardposition = [
  ["♜", "♞", "♝", "♚", "♛", "♝", "♞", "♜"],

  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],

  [" ", " ", " ", " ", " ", " ", " ", " "],

  [" ", " ", " ", " ", " ", " ", " ", " "],

  [" ", " ", " ", " ", " ", " ", " ", " "],

  [" ", " ", " ", " ", " ", " ", " ", " "],

  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],

  ["♖", "♘", "♗", "♔", "♕", "♗", "♘", "♖"],
];

app.get("/startposition", (req, res) => {
  res.json(boardposition);
});

app.post("/pt", (req, res) => {
  app.locals.from = game.board.getTile(req.body.row, req.body.col);
  let permittedTiles = app.locals.from.piece.permittedTiles;
  permittedTiles = permittedTiles.map((element) => {
    return {
      row: element.row,
      col: element.col,
    };
  });
  // console.log("permittedTiles === ", permittedTiles);
  res.json(permittedTiles);
});

app.post("/to", (req, res) => {
  app.locals.to = game.board.getTile(req.body.row, req.body.col);
  res.json(game.move(app.locals.from, app.locals.to));
});

app.listen(8081, function () {
  console.log("ExpressJS is running on port 8081");
});
