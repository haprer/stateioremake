

import City from "/src/gameobjects/city.js";
import { Sides, Side } from "/src/main.js";
import settings from "/src/gamesettings.js";


/**
 * This class will be responsible for: 
 *  1. Increasing the population of the cities over time 
 *  2. Calculation the AI moves and starting them. 
 */
class SideManager { 


    constructor() {

        /**@type {Set<City>} */
        this.cities = new Set();
 
        this.update = this.update.bind(this);

        this.timerID = setInterval(this.update, settings.side_update_rate);
    }


    update() { 
        console.error("SideManager.update() should be called on a subclass of SideManager.");
    }

    destroy() {
        clearInterval(this.timerID);
    }

    addCity(city) {
        this.cities.add(city);
    }

    removeCity(city) {
        this.cities.delete(city);
    }

}

export default SideManager;