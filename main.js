import "./style.css";
import Phaser from "phaser";
import io from "socket.io-client";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.remotePlayer;
    this.cursor;
    this.playerSpeed = 100;
    this.socket = null;
    this.playerId = "player1"; // Assign a unique player ID
  }

  // load the assets
  preload() {
    this.load.image("table", "/assets/table.png");
    this.load.image("avatar", "/assets/avatar/Idle.png");
    for (let i = 0; i <= 9; i++) {
      this.load.image(`walk_${i.toString().padStart(3, '0')}`, `/assets/avatar/walk/walk_${i.toString().padStart(3, '0')}.png`);
    }
  }

  // Set up and initialize game objects
  create() {
    this.cameras.main.setBackgroundColor("#84AFA6");
    const table = this.physics.add.staticImage(this.cameras.main.width / 2, this.cameras.main.height / 2, "table").setOrigin(0.5, 0.5);

    this.anims.create({
      key: 'walk',
      frames: [
        { key: 'walk_000' },
        { key: 'walk_001' },
        { key: 'walk_002' },
        { key: 'walk_003' },
        { key: 'walk_004' },
        { key: 'walk_005' },
        { key: 'walk_006' },
        { key: 'walk_007' },
        { key: 'walk_008' },
        { key: 'walk_009' },
      ],
      frameRate: 10,
      repeat: -1
    });

    // Create player and remote player sprites
    this.player = this.physics.add.sprite(400, 300, "avatar").setScale(0.1);
    this.remotePlayer = this.physics.add.sprite(500, 300, "avatar").setScale(0.1); // initial position for remote player
    this.remotePlayer.setTint(0x00ff00); // Different color to distinguish remote player

    this.player.setCollideWorldBounds(true);
    this.remotePlayer.setCollideWorldBounds(true);
    this.cursor = this.input.keyboard.createCursorKeys();

    // Initialize the WebSocket connection
    this.socket = new WebSocket("ws://10.145.107.131:8080/ws");

    this.socket.onopen = () => {
      console.log("[open] Connection established");
      this.socket.send(`Player connected: ${this.playerId}`);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.playerId !== this.playerId) {
        this.updateRemotePlayer(data);
      }
    };
  }

  // Update the position of the remote player based on received data
  updateRemotePlayer(data) {
    if (this.remotePlayer) {
      this.remotePlayer.setPosition(data.x, data.y);
    }
  }

  // The game loop, Runs every frame to manage game logic
  update() {
    const { left, right, up, down } = this.cursor;

    this.player.setVelocity(0);

    let moving = false;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.anims.play("walk", true);
      moving = true;
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play("walk", true);
      moving = true;
    } else if (up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
      this.player.anims.play("walk", true);
      moving = true;
    } else if (down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
      this.player.anims.play("walk", true);
      moving = true;
    } else {
      this.player.anims.stop();
    }

    if (moving) {
      const playerData = {
        playerId: this.playerId,
        x: this.player.x,
        y: this.player.y,
      };
      this.socket.send(JSON.stringify(playerData));
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  canvas: document.getElementById("gameCanvas"),
  physics: {
    default: "arcade",
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
