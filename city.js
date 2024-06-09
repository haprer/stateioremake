import Phaser from "phaser";
import { Sides, Side} from "./main";


export const default_pop = 20; 
export const default_radius = 10;

class City extends Phaser.GameObjects.Container { 

    // Default constructor - 
        /** Create with a radius of 10 
     * @param {Phaser.Scene} scene - 
     * @param {Side} side - A side object includes the color of each state
     * @param {Phaser.Physics.Arcade.Group} popGroup - A group for all population circles (for managing collisions between them)
     */
    constructor(scene, x, y, side, popGroup) {
        super(scene, x, y);

        //class state 
        this.scene = scene;
        this.side = side; 
        this.pop = default_pop;
        this.radius = default_radius;


        //create the graphics and physics locations

        //the city box needs to encompass both the text and the circle 
        this.fontSize = 11; 
        this.padding = 5; //size between circle and text as well as padding around the city as a whole
        /**
         *  *******************
         *  *\\\\\padding\\\\\*
         *  *\\             \\*
         *  *\\   Circle    \\*
         *  *\\             \\*
         *  *\\\\\\\\\\\\\\\\\*
         *  *\\    Text     \\*
         *  *\\\\\\\\\\\\\\\\\*
         *  *******************
         * 
         */

        //Add this city to the scene 

        var h = this.padding + this.radius * 2 + this.padding + this.fontSize + this.padding; 
        var w = this.padding + this.radius * 2 + this.padding; 

        //size and position of the city container graphics
        this.setSize(w, h);

        this.setPosition(x, y); 


        //set the clickable area 
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);


        // Add the container to the scene
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this); 

        this.body.setSize(w, h); 
        this.body.setImmovable(true);



        this.circle = this.scene.add.circle(0, 0, this.radius, this.side.color, 1); //x, y, color, alpha 
        this.label = 
        this.scene.add.text(0, 0, `${this.pop}`, {
            fontSize: `${this.fontSize}px`, 
            color: '#000000',
            align: 'center',
        } );
        
        this.circle.setOrigin(.5, .5); 
        this.label.setOrigin(.5, .5); 


        //the locations are relative to the origin at container center eg (0,0) for object = (this.width/2, this.height/2) in container
        const circleY = (this.radius + this.padding ) - (h/2)
        const textY = (this.radius * 2 + this.padding * 2 + this.fontSize /2) - (h/2)
        
        this.circle.y = circleY; 
        this.label.y = textY; 


        this.add(this.circle);
        this.add(this.label);

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
        // generate little circles that fly towards the target
        this.sendPop(target, this.pop - 1); //send all the current population but one to the target city
        
    }

    /**
     * 
     * @param {City} target 
     * @param {integer} remaining 
     * @returns 
     */
    sendPop(target, remaining) { 
        if (remaining <= 0) { 
            console.log(`city::sendPop finished`); 
            return; 
        }
        if (this.pop <= 1) { 
            //the pop must have dropped (probably from other attackers entering)
            //cancel the movement 

            console.log(`city::sendPop finished (population 0)`);
            return;
        }
        
        const popCircle = this.scene.add.circle(this.x, this.y, 5, this.side.color, 1);
        this.scene.physics.add.existing(popCircle);
        this.popGroup.add(popCircle);
        this.pop--; 
        this.label.setText(`${this.pop}`);
        if (popCircle && target) { 
            this.scene.physics.moveToObject(popCircle, target, 100);

            //collision event with target city
            this.scene.physics.add.collider(popCircle, target, (popCircle, target) => {
                popCircle.destroy();
                target.hit(popCircle, this.side);
            });

        } else { 
            console.log("Error: popCircle or target is null");
        }    
        
        //schedule the next pop to be send 
        var taskID = setTimeout(() => {
            this.sendPop(target, remaining - 1)
        }, 500); 
    
    }

    /**
     * 
     * @param {Phaser.GameObjects.Arc} pop //the circle that just hit this city
     * @param {Side} side //the side of the population 
     * 
     * The circle will be removed and the population of the city will be updated  
     */
    hit(pop, side) {  
        if (side == Sides.NEUTRAL) { //for testing purposes only : TODO calculate wether to increase / decrease / change side /etc
            //or use color as a stand in for side? 
            console.log(`Hit from (${pop.color})`);
            this.pop = this.pop-1; 
            if(this.pop <= 0) { 
                this.setSide(Sides.PLAYER); 
                console.log("City Captured TODO: Change color")
            } else { 
                this.label.setText(`${this.pop}`)
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