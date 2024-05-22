import Phaser from "phaser";
import { Sides, Side} from "./main";



class City extends Phaser.GameObjects.Container { 

    // Default constructor - 
        /** Create with a radius of 10 
     * @param {Phaser.Scene} scene - 
     * @param {Side} side - A side object includes the color of each state
     */
    constructor(scene, x, y, side) {
        super(scene, x, y);

        //class state 
        this.scene = scene;
        this.side = side; 

        //Add this city to the scene 
        this.circle = this.scene.add.circle(x, y, 10, this.side.color, 1); //x, y, color, alpha 

    }

    /**
     * 
     * @param {Side} newSide 
     */
    setSide(newSide) { 
        this.side = newSide;
        this.circle.setFillStyle(this.side.color);
    }

    // @Override
    update() { 
        
    }

}


export default City;