import './style.css'
import Phaser from 'phaser'
import City from './city';



const bgSize = 500;
const cityLocations = [[400,150],[250,160],[140,180],[60,200],[360, 300],[250,350],[120,290]];


export class Side { 
  
    /**
     * @param {integer} num - 
     * @param {integer} color
     */
  constructor(num, color) { 
    this.num = num; 
    this.color = color;
  }
} 

export const Sides = { 
  PLAYER: new Side(1, 0x0000FF),
  NEUTRAL: new Side(0, 0x333333),
  RED: new Side(2, 0xFF0000), 
  GREEN: new Side(3, 0x00FF00),
  PURPLE: new Side(4, 0xc300ff)
}


class GameScene extends Phaser.Scene { 
  constructor() { 
    super("scene-game"); 

    /** @type {Array<City>} */
    this.cities = []
    /**@type {City}  */
    this.selected;

    this.pointerLocation = [0,0]; //the current location of the pointer (while pressed);
  }

  preload() {
    this.load.image("usaMap", "/assets/maps/america_blob.png");

  } 

  create() {
    this.add.image(0,0, "usaMap").setOrigin(0,0);

    for (let i = 0; i < 7; i++) { 
      let x = cityLocations[i][0];
      let y = cityLocations[i][1];
      let city = new City(this, x, y, Sides.NEUTRAL);
      console.log(`city location set to ${x}, ${y}`);
      city.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => this.handlePointerDown(pointer, city));
      this.cities.push(city);
    }

    this.cities[0].setSide(Sides.PLAYER);


  } 

  update() {

  } 

  /**
   * 
   * @param {Phaser.Input.Pointer} pointer 
   * @param {City} city
   */
  handlePointerDown(pointer, city) { 
    console.log(`(${pointer.x}, ${pointer.y})`);
    this.selected = city; 

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