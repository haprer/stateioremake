import City from "./city.js";
import SideManager from "./sidemanager.js";
import { Sides, Side } from "./main.js";
import settings from "./gamesettings.js";



class PlayerManager extends SideManager { 
    
        constructor() {
            super();

            this.increasePopulation = this.increasePopulation.bind(this);
            //set up the population counters 
            this.popTaskId = setInterval(this.increasePopulation, settings.player_pop_rate);
        }


        /**
         * @override from SideManager
         */
        update() { 
            //nothing to do here for now 
        }

        /**
         * This function will be responsible for increasing the population of the cities over time.
         */
        increasePopulation() {
            this.cities.forEach(city => {
                if (city.pop < settings.max_pop) city.incrementPop();
            });
        }



}

export default PlayerManager;