import './style.css'
import Phaser from 'phaser'
import City from './city';
import PlayerManager from './game/playermanager';
import NeutralManager from './game/neutralmanager';



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
    
    /** @type {Phaser.GameObjects.Image} */
    this.background; 

    //this section used for detecting click and drag events 
    /**@type {City}  */
    this.selected;
    this.pointerLocation = [0,0]; //the current location of the pointer (while pressed);
    /** @type {Phaser.GameObjects.Graphics}*/
    this.dragLine = null; //used to mark where the user is draging the cursor from the last clicked city 

    /** @type {Phaser.Physics.Arcade.Group} */
    this.popGroup = null; 

  }

  preload() {
    this.load.image("usaMap", "/assets/maps/america_blob.png");

  } 

  create() {
    this.background = this.add.image(0,0, "usaMap").setOrigin(0,0).setInteractive();
    this.popGroup = this.physics.add.group(); // Group for pop objects
      //collision rules for the pop objects -> enemies should kill eachother and allies should pass through eachother. 
      // Manage collisions between the moving populations 
      this.physics.add.overlap(this.popGroup, this.popGroup, (pop1, pop2) => { 

      });


    for (let i = 0; i < 7; i++) { 
      let x = cityLocations[i][0];
      let y = cityLocations[i][1];
      let city = new City(this, x, y, Sides.NEUTRAL, this.popGroup);
      console.log(`city location set to ${x}, ${y}`);
      city.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => this.cityClick(pointer, city), this);
      this.cities.push(city);
    }
    
    // Create the triangle graphics object
    this.dragLine = this.add.graphics();

    this.input.on(Phaser.Input.Events.POINTER_MOVE, this.pointerMove, this);

    this.background.on(Phaser.Input.Events.POINTER_DOWN, this.backgroundClick, this);





    //start the game logic and ai controllers 
    this.playerManager = new PlayerManager();
    this.neutralManager = new NeutralManager();
    this.cities.forEach(city => city.setSide(Sides.NEUTRAL));
    this.cities[0].setSide(Sides.PLAYER);
    
  } 

  update() {
    // console.log(`Pointer location: ${this.pointerLocation}`);
  } 


  /**
   * 
   * @param {Phaser.Input.Pointer} pointer 
   */
  pointerMove(pointer) { 
    // console.log("Pointer Move"); 
    if (this.selected != null) { 
      // console.log("Drag logic");
      this.dragLine.clear(); 
      this.dragLine.setVisible(true); 
      // this.dragLine.lineStyle(3, 0x999999, .2); 
      this.dragLine.fillStyle(0x999999, .5);
      this.dragLine.beginPath();
      let a = new Phaser.Math.Vector2(pointer.x - this.selected.x, pointer.y - this.selected.y); 
      a.rotate(Phaser.Math.PI2 / 4);
      a.setLength(this.selected.radius); 
      let b = new Phaser.Math.Vector2(pointer.x - this.selected.x, pointer.y - this.selected.y); 
      b.rotate(-(Phaser.Math.PI2 / 4));
      b.setLength(this.selected.radius); 
      this.dragLine.moveTo(pointer.x, pointer.y);
      this.dragLine.lineTo(this.selected.x + a.x, this.selected.y + a.y);
      this.dragLine.lineTo(this.selected.x + b.x, this.selected.y + b.y); // Example third point
      this.dragLine.closePath();
      this.dragLine.fillPath();
      this.dragLine.strokePath();
    } else { 
      this.dragLine.setVisible(false);
    }
  }

  /**
   * 
   * @param {Phaser.Input.Pointer} pointer 
   * @param {City} city
   */
  cityClick(pointer, city) { 
    this.pointerLocation = [pointer.x, pointer.y];

    //decide what to do based on the currently selected city and the recent click 
    // console.log(`City Click at ${this.pointerLocation})`);
    if (this.selected == null && city.isPlayer()) { //this is the first click on a city, there is not a previous drag so set selected and finish
      this.selected = city;
      return;
    }
    //this click is on a new city, so start sending the population
    if (city != this.selected) { 
      this.selected.sendPopTo(city);
      console.log(`Population send started`);
    }
    //the selected city sends its pop to the new city, capturing it if possible.
    //create a web worker to handle the transfer of population
    //wether population is being sent or this is the second click on the same city -> cancel the drag line 
    this.selected = null;
    this.dragLine.clear(); 
    this.dragLine.setVisible(false); 
    
  }

  /**
   * 
   * @param {Phaser.Input.Pointer} pointer 
   */
  backgroundClick(pointer) { 
    // console.log("Background Click");
    
    this.selected = null;
    this.dragLine.clear();
    this.dragLine.setVisible(false);
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
      debug:false
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


export default GameScene;