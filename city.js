import Phaser from "phaser";
import { Sides, Side} from "./main";


export const default_pop = 20; 
export const default_radius = 10;

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
        this.pop = default_pop;
        this.radius = default_radius;

        //Add this city to the scene 
        this.circle = this.scene.add.circle(0, 0, this.radius, this.side.color, 1); //x, y, color, alpha 
        this.label = this.scene.add.text( -(this.radius), (this.radius * 1.5), `${this.pop}` );
        this.location = [x,y];

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
     * @returns {boolean} - True if the city is a player city, false otherwise
     */
    isPlayer() { 
        return this.side == Sides.PLAYER; 
    }

    /**
     * 
     * @param {City} target 
     */
    sendPopTo(target) { 
        //record the current population of this city, and generate little circles that fly towards the target
        //city until the population is 0.
        while (this.pop > 0) {
            const popCircle = this.scene.add.circle(this.x, this.y, 5, this.side.color, 1);
            this.scene.physics.add.existing(popCircle);
            this.pop--; 
            this.label.setText(`${this.pop}`);
            if (popCircle && target) { 
                this.scene.physics.moveToObject(popCircle, target, 100);
                this.scene.physics.add.collider(popCircle, target, (popCircle, target) => {
                    popCircle.destroy();
                    target.attack(this.side);
    
                });
            } else { 
                console.log("Error: popCircle or target is null");
            }
 
        }
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