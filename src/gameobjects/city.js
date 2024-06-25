import Phaser from "phaser";
import GameScene, { Sides, Side} from "/src/main.js";
import settings from "/src/gamesettings.js";


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
        /** @type {GameScene} */
        this.scene = scene;
        this.side = side; 
        this.pop = settings.default_pop;
        this.radius = default_radius;
        this.popGroup = popGroup;


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


        this.popTaskID = null; //the task id for the population sending task

        this.setSide = this.setSide.bind(this);

    }

    incrementPop() {
        this.pop++;
        this.label.setText(`${this.pop}`);
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

        if (this.popTaskID) { 
            clearTimeout(this.popTaskID); 
        }

        // generate little circles that fly towards the target
        this.sendPop(target, this.pop - 1); //send all the current population but one to the target city
        
    }

    /**
     * 
     * @param {City} target 
     * @param {integer} remaining 
     * 
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
        //important: Set the side of the circle - all circles must have a set side 
        popCircle.side = this.side;
        
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
            console.error("City::sendPop  -> Error: popCircle or target is null");
        }    
        
        //schedule the next pop to be send 
        this.popTaskID = setTimeout(() => {
            this.sendPop(target, remaining - 1)
        }, settings.pop_rate); 
    
    }

    /**
     * 
     * @param {Phaser.GameObjects.Arc} pop //the circle that just hit this city
     * @param {Side} side //the side of the population 
     * 
     * The circle will be removed and the population of the city will be updated  
     */
    hit(pop, side) {  
        if (side == this.side) {
            this.pop++;
            this.label.setText(`${this.pop}`);
        } else {
            this.pop = this.pop-1; 
            if(this.pop <= 0) { 
                this.setSide(side); 
            } else { 
                this.label.setText(`${this.pop}`)
            }
        }
        pop.destroy();
    }

    /**
     * 
     * @param {Side} newSide 
     */
    setSide(newSide) { 

        //take this side out of the current manager 
        switch (this.side) { 
            case Sides.PLAYER: 
                this.scene.playerManager.removeCity(this);
                break;
            case Sides.RED: 
                this.scene.redManager.removeCity(this);
                break;
            case Sides.GREEN: 
            case Sides.PURPLE: 
                console.error("Green and Purple cities not implemented yet");
                break;
            case Sides.NEUTRAL: 
                this.scene.neutralManager.removeCity(this);
                break;
            default: 
                console.error("City::setSide() - invalid side");
                break;
        }

        //change the color
        this.side = newSide;
        this.circle.setFillStyle(this.side.color);

        //add this city to the new manager
        console.log(`City::setSide(${this.side})`);
        switch (this.side) {
            case Sides.PLAYER:
                this.scene.playerManager.addCity(this);
                break;
            case Sides.RED:
                this.scene.redManager.addCity(this);
                break;
            case Sides.GREEN:
            case Sides.PURPLE:
                console.error("AI cities not implemented yet");
                break;
            case Sides.NEUTRAL: 
                this.scene.neutralManager.addCity(this);
                break;
            default:
                console.error("City::setSide() - invalid side");
                break;
        }
    }



    // @Override
    update() { 
        
    }

}


export default City;