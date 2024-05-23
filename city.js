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
        this.pop = 20; 
        this.radius = 10;

        //Add this city to the scene 
        this.circle = this.scene.add.circle(0, 0, this.radius, this.side.color, 1); //x, y, color, alpha 
        this.label = this.scene.add.text( -(this.radius), (this.radius * 1.5), `${this.pop}` );

        this.add(this.circle);
        this.add(this.label);

        this.setSize(this.circle.width, this.circle.height);
        //set the clickable area to the circle -> remember 0,0 is upper left of this object so circle should be drawn at radius distance down 
        this.setInteractive(new Phaser.Geom.Circle(this.radius, this.radius, this.radius), Phaser.Geom.Circle.Contains);


        // Add the container to the scene
        this.scene.add.existing(this);

        this.setPosition(x, y); 



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