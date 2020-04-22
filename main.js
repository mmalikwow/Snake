const scl = 20;

const getRandomPos = () => {
  return (Math.floor(Math.random() * scl) * canvas.width) / scl;
};

const apple = {
  x: 0,
  y: 0,
  changePos: (obj = snake) => {
    let x = getRandomPos();
    let y = getRandomPos();

    if (obj)
      for (let b of obj.tail)
        if (b.x == x && b.y == y) {
          console.log("recursive");
          apple.changePos();
          return;
        }
    apple.x = getRandomPos();
    apple.y = getRandomPos();
  },
  eaten: (obj = snake.pos) => {
    return apple.x == obj.x && apple.y == obj.y;
  }
};

let snake;

const init = () => {
  apple.changePos();

  snake = new Snake();
};

let t = 0;
const loop = () => {
  ctx.fillStyle = "rgb(51,51,51)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //snake
  snake.show();
  if (!(t % 5)) snake.update();

  //apple
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, canvas.width / scl, canvas.height / scl);

  t++;
};

class Snake {
  constructor() {
    this.pos = { x: getRandomPos(), y: getRandomPos() };
    this.tail = [];
    this.length = 3;

    this.dir = { x: 0, y: 1 };
  }

  show() {
    ctx.fillStyle = "green";
    for (let b of this.tail) {
      ctx.fillRect(b.x, b.y, canvas.width / scl, canvas.height / scl);

      for (let c of this.tail)
        b != c && b.x == c.x && b.y == c.y ? this.die() : 0;
    }
  }

  update() {
    this.pos.x += (canvas.width / scl) * this.dir.x;
    this.pos.y += (canvas.height / scl) * this.dir.y;
    if (
      this.pos.x >= canvas.width ||
      this.pos.y >= canvas.height ||
      this.pos.x < 0 ||
      this.pos.y < 0
    )
      this.die();

    if (apple.eaten(this.pos)) {
      this.length++;
      apple.changePos();
    }

    if (this.tail.length >= this.length) this.tail.shift();
    this.tail.push(Object.assign({}, this.pos));
  }

  die() {
    this.pos = { x: getRandomPos(), y: getRandomPos() };
    this.tail = [];
    this.length = 3;

    this.dir = { x: 0, y: 1 };
  }
}

document.addEventListener("keydown", key => {
  let keyCode = key.keyCode;
  if (keyCode == 87) snake.dir.y = -1;
  if (keyCode == 83) snake.dir.y = 1;
  if (keyCode == 87 || keyCode == 83) snake.dir.x = 0;
  if (keyCode == 65) snake.dir.x = -1;
  if (keyCode == 68) snake.dir.x = 1;
  if (keyCode == 65 || keyCode == 68) snake.dir.y = 0;
});

window.onload = function() {
  canvas = Object.assign(document.createElement("canvas"), {
    width: 800,
    height: 800
  });

  ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);
  init();
  setInterval(loop, 1000 / 60);
};
