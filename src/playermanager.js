import City from "/src/gameobjects/city.js";
import SideManager from "/src/sidemanager.js";
import { Sides, Side } from "/src/main.js";
import settings from "/src/gamesettings.js";



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
                // console.log(`PlayerManager::increasePopulation() city at ${city.x}, ${city.y}`);
                if (city.pop < settings.max_pop) city.incrementPop();
            });
        }



}

export default PlayerManager;