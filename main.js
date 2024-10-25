import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = 100;
  }
  // load the assets
  preload() {
    this.load.image("table", "/assets/table.png");
    this.load.image("avatar","/assets/avatar/Idle.png")
    for (let i = 0; i <= 9; i++) {
      this.load.image(`walk_${i.toString().padStart(3, '0')}`, `/assets/avatar/walk/walk_${i.toString().padStart(3, '0')}.png`);
    }
  }
  // Set up and initialize game objects
  create() {
    this.cameras.main.setBackgroundColor("#84AFA6");
    const table = this.physics.add.staticImage(this.cameras.main.width / 2, this.cameras.main.height / 2, "table").setOrigin(0.5, 0.5);
    // Define the animation by specifying each frame key
    // TODO: create a separate animation for walking in different direction 
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
    this.player = this.physics.add.sprite(400, 300, "avatar").setScale(0.2);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    // Enable collision between the player and the table
    this.physics.add.collider(this.player, table);
    this.cursor = this.input.keyboard.createCursorKeys();
  }
  // The game loop, Runs every frame to manage game logic
  update() {
    const { left, right, up, down } = this.cursor;
    
    this.player.setVelocity(0);
    if (left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.anims.play('walk', true);
    }
    else if (right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
        this.player.anims.play('walk', true);
    }
    else if (up.isDown) {
        this.player.setVelocityY(-this.playerSpeed);
        this.player.anims.play('walk', true);
    }
    else if (down.isDown) {
        this.player.setVelocityY(this.playerSpeed);
        this.player.anims.play('walk', true);
    }
    // Stop animation if no keys are pressed
    else {
        this.player.anims.stop();
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