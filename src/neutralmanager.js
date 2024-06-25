
import SideManager from "/src/sidemanager.js";
import settings from "/src/gamesettings.js";

class NeutralManager extends SideManager {
    constructor() {
        super();
        this.increasePopulation = this.increasePopulation.bind(this);
        this.popTaskId = setInterval(this.increasePopulation, settings.neutral_pop_rate);
    }   

    /**
     * @override from SideManager
     */
    update() {
        //TODO
    }

    increasePopulation() { 
        this.cities.forEach(city => {
            // console.log(`AIManager::increasePopulation() city at ${city.x}, ${city.y}`);
            if (city.pop < settings.neutral_max_pop) city.incrementPop();
        }); 
    }


}

export default NeutralManager;
