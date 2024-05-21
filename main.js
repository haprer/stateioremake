import './style.css'
import Phaser from 'phaser'


const bgSize = 500;


class GameScene extends Phaser.Scene { 
  constructor() { 
    super("scene-game"); 

  }

  preload() {
    this.load.image("usaMap", "/assets/maps/america_blob.png");

  } 

  create() {
    this.add.image(0,0, "usaMap").setOrigin(0,0);

    this.add.circle(bgSize/2, bgSize / 2, 10, 0xff0000,1);

  } 

  update() {

  } 

}


const config = { 
  type: Phaser.WEBGL,
  width: bgSize,
  height: bgSize,
  canvas: gameCanvas,
  physics: { 
    default: "arcade",
    arcade: {
      gravity: {y:0},
      debug:true
    }
  },
  //scaling - requires more work to dynamically rescale images to fit - done in a method with a resize event listener that just 
  // changes the size of all the objects
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   width: window.innerWidth,
  //   height: window.innerHeight
  // },
  scene:[GameScene]
}

const game = new Phaser.Game(config)