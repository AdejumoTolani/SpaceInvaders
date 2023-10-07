const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// screen.orientation.lock("landscape");

class Player {
  constructor() {
    this.velocity = {
      x: 0,
    };
    this.rotation = 0;
    this.opacity = 1;
    const image = new Image();
    image.src = "./img/pngwing.com (4).png";

    image.onload = () => {
      const scale = 0.15;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.image = image;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    ctx.rotate(this.rotation);

    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    ctx.restore();
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4.5;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class InvaderProjectile {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor(position) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    image.src = "./img/pngwing.com (5).png";

    image.onload = () => {
      const scale = 0.05;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.image = image;
      this.position = {
        x: position.x,
        y: position.y,
      };
      //   console.log(this.height)
    };
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile(
        {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        {
          x: 0,
          y: 5,
        }
      )
    );
  }
  update(velocity) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };
    this.invaders = [];

    const cols = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = cols * 36;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.invaders.push(
          new Invader({
            x: i * 36,
            y: j * 25,
          })
        );
      }
    }
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

class Particle {
  constructor(position, velocity, radius, color, fades) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.01;
  }
}

const player = new Player();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const projectiles = [];
const grids = [];
let invaderProjectiles = [];
const particles = [];
let frames = 0;
let game = {
  over: false,
  active: true,
};

for (i = 0; i < 100; i++) {
  particles.push(
    new Particle(
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      {
        x: 0,
        y: 0.4,
      },
      Math.random() * 2,
      "white"
    )
  );
}

createParticles = (object, color, fades) => {
  for (i = 0; i < 15; i++) {
    particles.push(
      new Particle(
        {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        Math.random() * 2,
        color,
        fades
      )
    );
  }
};
animate = () => {
  if (!game.active) return;
  requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  player.update();

  //remove particles from /screen
  particles.forEach((particle, index) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  //garbage collection for offscreen invader projectiles
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else {
      invaderProjectile.update();
    }

    //projectile hits us
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);

      setTimeout(() => {
        game.active = false;
      }, 5000);
      createParticles(player, "white", true);
    }
  });

  //garbage collection for our own off screen fired projectiles
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();

    //spawn enemy projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, index) => {
      invader.update(grid.velocity);

      //we take out enemy
      projectiles.forEach((projectile, proIndex) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            //check for invader
            const invaderFound = grid.invaders.find((currInvader) => {
              return currInvader == invader;
            });
            //check for projectile
            const proFound = projectiles.find((currPro) => {
              return currPro == projectile;
            });

            if (invaderFound && proFound) {
              createParticles(invader, `#CBC3E3`, true);
              grid.invaders.splice(index, 1);
              projectiles.splice(proIndex, 1);

              //reduce grid length when a whole invader row at any edge is taken out
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  //move player
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x <= canvas.width - player.width
  ) {
    player.velocity.x = 5;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }
  //spawn enemies
  if (frames % 500 === 0) {
    grids.push(new Grid());
  }

  frames++;
};

animate();

addEventListener("keydown", (event) => {
  if (game.over) return;
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;

  }
});

addEventListener("keyup", (event) => {
  if (game.over) return;
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case " ":
      projectiles.push(
        new Projectile(
          {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          {
            x: 0,
            y: -10,
          }
        )
      );
      break;
  }
});

document.addEventListener("touchstart", (e) => {
  const touchX = e.touches[0].clientX;

        projectiles.push(
          new Projectile(
            {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            {
              x: 0,
              y: -10,
            }
          )
        );
  if (touchX < canvas.width / 2) {
    // Move left
    player.position.x = -5;
    player.rotation = -0.15;
  } else {
    // Move right
    player.velocity.x = 5;
    player.rotation = 0.15;
  }
});
