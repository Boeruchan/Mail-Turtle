function start() {
  let button = (document.getElementById("button").style.display = "none");
  let startScreen = (document.getElementById("startScreen").style.display = "none");
  let canvas = (document.getElementById("canvas").style.display = "block");
  document.querySelector("#message").innerHTML = "Use arrow keys to deliver the mail to the cat";

  // play area
  const grasses = new Array(6).fill(new Array(6).fill("X"));

  const bushes = [
    ["X", " ", " ", "X", "X", "X"],
    [" ", " ", " ", " ", "X", "X"],
    [" ", " ", " ", " ", " ", "X"],
    ["X", " ", " ", " ", " ", " "],
    ["X", " ", " ", " ", " ", "X"],
    ["X", "X", " ", "X", "X", "X"],
  ];

  const woods = [
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", "X", " ", " ", " ", " "],
    [" ", " ", " ", " ", "X", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
  ];

  const cats = [
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", "X"],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
  ];

  const turtles = [
    [" ", "X", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
  ];

  const holes = [
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", "X", " ", " ", " ", " "],
    [" ", " ", " ", " ", "X", " "],
    [" ", " ", " ", " ", " ", " "],
  ];

  const waters = [
    [" ", " ", "X", " ", " ", " "],
    [" ", " ", "X", " ", " ", " "],
    [" ", " ", " ", " ", " ", " "],
    [" ", " ", "X", " ", " ", " "],
    [" ", " ", "X", " ", " ", " "],
    [" ", " ", "X", " ", " ", " "],
  ];

  let playerX = 1;
  let playerY = 0;

  /**
   * Renders a grid of blocks with a given texture
   * @param blocks
   * @param textureImage
   * @param canvas
   * @returns {Promise<unknown>}
   */
  const renderBlocks = (blocks, textureImage, canvas) => {
    // Scale the grid of the nested blocks array to the pixel grid of the canvas
    const pixelWidthBlock = canvas.width / blocks[0].length;
    const pixelHeightBlock = canvas.height / blocks.length;
    const context = canvas.getContext("2d");

    blocks.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "X") {
          context.drawImage(
            textureImage,
            x * pixelWidthBlock,
            y * pixelHeightBlock,
            pixelWidthBlock,
            pixelHeightBlock
          );
        }
      });
    });
  };

  /**
   * Loads a texture async
   * @param texture
   * @returns {Promise<unknown>}
   */
  const loadTexture = (texture) =>
    new Promise((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      });
      image.src = texture;
    });

  Promise.allSettled([
    loadTexture("./img/grass.png"),
    loadTexture("./img/bush.png"),
    loadTexture("./img/cat.png"),
    loadTexture("./img/wood.png"),
    loadTexture("./img/turtle.png"),
    loadTexture("./img/hole.png"),
    loadTexture("./img/water.png"),
  ]).then((results) => {
    const [
      grassTexture,
      bushTexture,
      catTexture,
      woodTexture,
      turtleTexture,
      holeTexture,
      waterTexture,
    ] = results.map((result) => result.value);
    const canvas = document.querySelector("#canvas");

    const render = () => {
      renderBlocks(grasses, grassTexture, canvas);
      renderBlocks(bushes, bushTexture, canvas);
      renderBlocks(cats, catTexture, canvas);
      renderBlocks(woods, woodTexture, canvas);
      renderBlocks(holes, holeTexture, canvas);
      renderBlocks(waters, waterTexture, canvas);
      renderBlocks(turtles, turtleTexture, canvas);
    };

    render();

    window.addEventListener("keydown", (event) => {
      let xMovement = 0;
      let yMovement = 0;

      switch (event.key) {
        case "ArrowUp":
          yMovement = -1;
          break;
        case "ArrowDown":
          yMovement = 1;
          break;
        case "ArrowLeft":
          xMovement = -1;
          break;
        case "ArrowRight":
          xMovement = 1;
          break;
      }

      const newPlayerX = playerX + xMovement;
      const newPlayerY = playerY + yMovement;

      // Remove player at old position
      turtles[playerY][playerX] = " ";

      // Set player at new position
      turtles[newPlayerY][newPlayerX] = "X";
      playerX = newPlayerX;
      playerY = newPlayerY;

      // Collision with end of playing field
      if (
        newPlayerX < 0 ||
        newPlayerY < 0 ||
        newPlayerX > grasses[0].length - 1 ||
        newPlayerY > grasses.length - 1
      ) {
        return;
      }
      // bush collision
      if (bushes[newPlayerY][newPlayerX] === "X") {
        return;
      }

      // wood collision
      if (woods[newPlayerY][newPlayerX] === "X") {
        if (
          woods[newPlayerY + yMovement][newPlayerX + xMovement] === "X" ||
          bushes[newPlayerY + yMovement][newPlayerX + xMovement] === "X"
        ) {
          return;
        }

        woods[newPlayerY][newPlayerX] = " ";
        woods[newPlayerY + yMovement][newPlayerX + xMovement] = "X";
      }

      // holes collision
      if (holes[newPlayerY][newPlayerX] === "X") {
        let canvas = (document.getElementById("canvas").style.display = "none");
        var x = document.createElement("IMG");
        x.setAttribute("src", "./img/holeScreen.png");
        document.body.appendChild(x);
        document.querySelector("#message").innerHTML = "Ohnoes! Mail turtle fell into a hole!";

        var y = document.createElement("BUTTON");
        y.id = "buttonRestart";
        y.setAttribute("onclick", "  window.location.reload();");
        var t = document.createTextNode("Try again");
        y.appendChild(t);
        document.body.appendChild(y);
        return;
      }

      // water collision
      if (waters[newPlayerY][newPlayerX] === "X") {
        let canvas = (document.getElementById("canvas").style.display = "none");
        var x = document.createElement("IMG");
        x.setAttribute("src", "./img/waterScreen.png");
        x.id = "waterScreen";
        document.body.appendChild(x);
        document.querySelector("#message").innerHTML =
          "Ohnoes! Mail turtle is actually a tortoise. Tortoise can't swim!";

        var y = document.createElement("BUTTON");
        y.id = "buttonRestart";
        y.setAttribute("onclick", "  window.location.reload();");
        var t = document.createTextNode("Try again");
        y.appendChild(t);
        document.body.appendChild(y);
      }

      // good ending of the game
      if (cats[newPlayerY][newPlayerX] === "X") {
        let canvas = (document.getElementById("canvas").style.display = "none");
        var x = document.createElement("IMG");
        x.setAttribute("src", "./img/doneScreen.png");
        document.body.appendChild(x);
        document.querySelector("#message").innerHTML = "You delivered the mail to the forest cat!";

        var y = document.createElement("BUTTON");
        y.id = "buttonRestart";
        y.setAttribute("onclick", "  window.location.reload();");
        var t = document.createTextNode("Try again");
        y.appendChild(t);
        document.body.appendChild(y);
        return;
      }

      render();
    });
  });
}
