class Controller {
  static #movestarted = false;
  static #from;
  static #rowcheck;
  static #colcheck;
  static #to;
  static #permittedTiles = [];
  static #permittedLocations = [];
  static #status = null;
  static #turn = true;
  static async dispatch(e) {
    console.log(`Alert!! event is dispatched.....`);
    if (!Controller.#movestarted) {
      console.log(`When #movestarted is false`);
      if (Controller.#turn) {
        console.log(`When #movestarted is false &&& #turn is true`);
        if (e.target.dataset["side"] === "true") {
          if (e.target.innerHTML === " ") return;
          Controller.#from = {
            row: e.target.dataset["row"],
            col: e.target.dataset["col"],
          };
          console.log(`Printing row and col of Clicked Piece`);
          console.log(`row ---- ${Controller.#from.row}`);
          console.log(`col ---- ${Controller.#from.col}`);
          Controller.#rowcheck = Controller.#from.row;
          Controller.#colcheck = Controller.#from.col;
          Controller.#movestarted = true;
          Controller.#permittedTiles = await fetch("/pt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Controller.#from),
          }).then((response) => response.json());
          Controller.#permittedLocations.length = 0;
          console.log(
            "permittedTiles after move is started is ---- ",
            Controller.#permittedTiles
          );
          Controller.#permittedTiles.forEach((e) => {
            let row = e.row;
            let col = e.col;
            let side = "true";
            let s = '[data-row ="' + row + '][data-col = "' + col + '"]';
            let td = document.querySelector(
              '[data-row ="' +
                row +
                '"][data-col = "' +
                col +
                '"][data-side ="' +
                side +
                '"]'
            );
            Controller.#permittedLocations.push(td);
            td.setAttribute("class", "selected");
          });
        }
      } else {
        console.log(`When #movestarted is false &&& #turn is false`);
        if (e.target.dataset["side"] === "false") {
          if (e.target.innerHTML === "") return;
          Controller.#from = {
            row: e.target.dataset["row"],
            col: e.target.dataset["col"],
          };
          console.log(`Printing row and col of Clicked Piece`);
          console.log(`row ---- ${Controller.#from.row}`);
          console.log(`col ---- ${Controller.#from.col}`);
          Controller.#movestarted = true;
          Controller.#permittedTiles = await fetch("/pt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Controller.#from),
          }).then((response) => response.json());
          Controller.#movestarted = true;
          Controller.#permittedLocations.length = 0;
          Controller.#permittedTiles.forEach((e) => {
            let row = e.row;
            let col = e.col;
            let side = "false";
            let td = document.querySelector(
              '[data-row ="' +
                row +
                '"][data-col = "' +
                col +
                '"][data-side ="' +
                side +
                '"]'
            );
            Controller.#permittedLocations.push(td);
            td.setAttribute("class", "selected");
          });
        }
      }
    } else {
      console.log(`_____Executing else part when #movestarted is true_____`);
      Controller.#movestarted = false;
      Controller.#to = {
        row: e.target.dataset["row"],
        col: e.target.dataset["col"],
      };
      Controller.#permittedLocations.forEach((e) => {
        if ((parseInt(e.dataset["row"]) + parseInt(e.dataset["col"])) % 2 == 0)
          e.setAttribute("class", "black");
        else e.setAttribute("class", "white");
      });

      if (Controller.#permittedLocations.indexOf(e.target) != -1) {
        let b = await fetch("/to", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Controller.#to),
        }).then((response) => response.json());
        if (b === "Black" || b === "White") {
          Controller.#status = b;
          Controller.cleanup();
        } else if (b) {
          renderchess(b);
          Controller.#turn = !Controller.#turn;
        } else {
          alert("There was some server error!");
          Controller.cleanup();
        }
      }
      if (Controller.#permittedLocations.indexOf(e.target) == -1) {
        if (
          e.target.dataset["row"] != Controller.#rowcheck ||
          e.target.dataset["col"] != Controller.#colcheck
        ) {
          Controller.dispatch(e);
        }
      }
      Controller.#from = null;
      Controller.#to = null;
      Controller.#permittedTiles.length = 0;
      console.log(`_____Exiting that else part_____`);
    }
  }

  static cleanup() {
    let c = document.getElementById("chess");
    c.removeChild(document.getElementById("chessboard1"));
    c.removeChild(document.getElementById("chessboard2"));
    if (Controller.#status) {
      let h = document.createElement("h1");
      h.innerHTML = `${Controller.#status} has Won `;
      c.appendChild(h);
    }
  }
}
