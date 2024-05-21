import Phaser from "phaser";

class City extends Phaser.GameObjects.Container { 
    constructor(scene, x, y, imageKey, text, gameStateData) {
        super(scence, x, y);

        this.gameStateData = gameStateData

    }


    // @Override
    update() { 

    }

}